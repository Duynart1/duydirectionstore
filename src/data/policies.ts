import type { Policy } from "@/types";

export const policies: Policy[] = [
  {
    id: "policy-1",
    title: "Chính sách bảo mật",
    slug: "chinh-sach-bao-mat",
    content: `
      <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Thông tin chỉ được sử dụng để xử lý đơn hàng và liên hệ hỗ trợ.</p>
      <p>Chúng tôi không bán hoặc chia sẻ thông tin với bên thứ ba vì mục đích thương mại.</p>
    `,
  },
  {
    id: "policy-2",
    title: "Hướng dẫn mua hàng",
    slug: "huong-dan-mua-hang",
    content: `
      <p><strong>Bước 1:</strong> Chọn sản phẩm và biến thể (thời hạn, gói) phù hợp.</p>
      <p><strong>Bước 2:</strong> Thêm vào giỏ hàng. Có thể thêm nhiều sản phẩm.</p>
      <p><strong>Bước 3:</strong> Vào trang Giỏ hàng, kiểm tra và nhấn "Gửi yêu cầu".</p>
      <p><strong>Bước 4:</strong> Điền form liên hệ (Họ tên, SĐT, Zalo, Email, Ghi chú) và gửi qua Zalo hoặc sao chép nội dung gửi cho admin.</p>
      <p><strong>Bước 5:</strong> Admin sẽ liên hệ xác nhận và hướng dẫn thanh toán chuyển khoản. Sau khi nhận tiền, tài khoản sẽ được giao trong thời gian cam kết.</p>
    `,
  },
  {
    id: "policy-3",
    title: "Chính sách đổi trả",
    slug: "chinh-sach-doi-tra",
    content: `
      <p>Sản phẩm số (tài khoản, key) sau khi giao không hỗ trợ hoàn tiền nếu đã đăng nhập thành công.</p>
      <p>Trường hợp lỗi không đăng nhập được, không đúng mô tả: hỗ trợ đổi tài khoản mới hoặc hoàn tiền trong vòng 24–48 giờ.</p>
    `,
  },
  {
    id: "policy-4",
    title: "Quy định sử dụng",
    slug: "quy-dinh-su-dung",
    content: `
      <p>Khách hàng cam kết sử dụng sản phẩm đúng mục đích, tuân thủ điều khoản của nhà cung cấp gốc (Netflix, Spotify, v.v.).</p>
      <p>Chúng tôi không chịu trách nhiệm khi tài khoản bị khóa do vi phạm điều khoản từ phía nhà cung cấp.</p>
    `,
  },
];

export function getPolicyBySlug(slug: string): Policy | undefined {
  return policies.find((p) => p.slug === slug);
}

export function getAllPolicies(): Policy[] {
  return [...policies];
}
