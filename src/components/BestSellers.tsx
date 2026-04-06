export default function BestSellers() {
    const items = [
        { name: "Zoom", img: "Zoom" },
        { name: "Youtube", img: "Youtube" },
        { name: "Spotify", img: "Spotify" },
        { name: "Office 365", img: "Office 365" },
        { name: "Netflix", img: "Netflix" },
        { name: "Canva Pro", img: "Canva" },
    ];

    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto max-w-7xl px-4">
                <h2 className="text-2xl font-bold text-center mb-8 uppercase text-gray-800">
                    Phần mềm, Tài khoản bán chạy
                </h2>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="w-[120px] md:w-[150px] bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center p-4 cursor-pointer"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center text-xs text-gray-400 font-medium text-center p-2">
                                Ảnh {item.img}
                            </div>
                            <span className="font-semibold text-gray-700 text-sm md:text-base text-center">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}