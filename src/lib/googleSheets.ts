import "server-only";

// Raw row as returned by Google Sheets API (A:G)
type SheetRow = [
  string, // A: Mã Nhóm
  string, // B: Tên Hiển Thị Web
  string, // C: Loại Tài Khoản
  string, // D: Thời Hạn
  string, // E: Giá Bán (Number as string)
  string, // F: Mã SKU
  string? // G: Trạng Thái (TRUE/FALSE)
];

export interface SheetVariantRow {
  parentGroup: string;
  title: string;
  accountType: string;
  duration: string;
  price: number;
  sku: string;
  isActive: boolean;
}

export interface SheetProductGroup {
  parentGroup: string;
  title: string;
  variants: SheetVariantRow[];
  accountTypes: string[]; // unique values from column C
  durations: string[]; // unique values from column D
}

function parseBooleanFlag(value: string | undefined): boolean {
  if (!value) return false;
  return value.toString().trim().toLowerCase() === "true";
}

function parsePrice(value: string): number {
  // Google Sheets gives a raw number or string, we coerce to number
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function fetchSheetProductGroups(): Promise<SheetProductGroup[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const range =
    process.env.GOOGLE_SHEETS_RANGE ?? "Sheet1!A2:G";

  if (!apiKey || !spreadsheetId) {
    throw new Error(
      "GOOGLE_SHEETS_API_KEY và GOOGLE_SHEETS_SPREADSHEET_ID chưa được cấu hình trong biến môi trường."
    );
  }

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}`
  );
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), {
    // Rất quan trọng: chỉ gọi từ server-side
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Không thể fetch Google Sheets: ${res.status} ${res.statusText}`
    );
  }

  const data: {
    values?: SheetRow[];
  } = await res.json();

  const rows = (data.values ?? []) as SheetRow[];

  // 1. Map và lọc theo Trạng Thái (G === TRUE)
  const activeRows: SheetVariantRow[] = rows
    .map((row) => {
      const [
        parentGroup = "",
        title = "",
        accountType = "",
        duration = "",
        priceStr = "",
        sku = "",
        status = "",
      ] = row;

      return {
        parentGroup: parentGroup.trim(),
        title: title.trim(),
        accountType: accountType.trim(),
        duration: duration.trim(),
        price: parsePrice(priceStr),
        sku: sku.trim(),
        isActive: parseBooleanFlag(status),
      };
    })
    .filter((row) => row.parentGroup && row.title && row.isActive);

  // 2. Gom nhóm theo Mã Nhóm (A)
  const groupMap = new Map<string, SheetProductGroup>();

  for (const row of activeRows) {
    const existing = groupMap.get(row.parentGroup);
    if (!existing) {
      groupMap.set(row.parentGroup, {
        parentGroup: row.parentGroup,
        title: row.title, // lấy Cột B làm tiêu đề
        variants: [row],
        accountTypes: [],
        durations: [],
      });
    } else {
      existing.variants.push(row);
    }
  }

  // 3. Trích xuất động các giá trị unique cho C và D
  for (const group of groupMap.values()) {
    const typeSet = new Set<string>();
    const durationSet = new Set<string>();

    for (const v of group.variants) {
      if (v.accountType) typeSet.add(v.accountType);
      if (v.duration) durationSet.add(v.duration);
    }

    group.accountTypes = Array.from(typeSet);
    group.durations = Array.from(durationSet);
  }

  return Array.from(groupMap.values());
}

