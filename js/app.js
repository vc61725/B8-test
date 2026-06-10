const SUPABASE_URL =
"https://vfbxmednhbkcizyjojfc.supabase.co";

const SUPABASE_KEY =
"sb_publishable_7ciuMdtTX-PyYVr3PbUGDQ_HGtC1wvp";

const db =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.b8Data = [];

window.onload = async function () {

    document.getElementById("result").innerHTML =
        "正在載入商品主檔...";

    try {

        const { data, error } = await db
            .from("products")
            .select("*");

        if (error)
            throw error;

        window.b8Data = data || [];

        document.getElementById("result").innerHTML =
            `
            ✅ 商品主檔載入成功
            <br>
            共 ${window.b8Data.length} 筆資料
            `;

    }

    catch (error) {

        console.error(error);

        document.getElementById("result").innerHTML =
            `
            <span style="color:red">
            商品主檔載入失敗
            </span>
            `;

    }

};



function searchTDC() {

    const tdc =
        document
        .getElementById("tdcInput")
        .value
        .trim();

    const item =
        window.b8Data.find(
            x =>
                String(x.tdc).trim()
                ===
                tdc
        );

    if (!item) {

        document.getElementById("result").innerHTML =
            "查無資料";

        return;

    }

    const headerIndex =
    rows.findIndex(
        row =>
            row.includes("序號")
    );

const dataRows =
    rows.slice(
        headerIndex + 1
    );

document.getElementById("result").innerHTML =
`
headerIndex：

${headerIndex}

<br><br>

資料列：

${dataRows.length}
`;

    };

    reader.readAsArrayBuffer(file);

}



function downloadPDF() {

    html2pdf()

        .from(
            document.getElementById("result")
        )

        .save(
            "B8入倉通知單.pdf"
        );

}
