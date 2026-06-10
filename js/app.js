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

    document.getElementById("result").innerHTML =
        `
        <b>TDC：</b>
        ${item.tdc}

        <br>

        <b>全家代號：</b>
        ${item.family_code}

        <br>

        <b>日翊代號：</b>
        ${item.riyi_code}

        <br>

        <b>廠商：</b>
        ${item.vendor_name}

        <br>

        <b>國際條碼：</b>
        ${item.barcode}

        <br>

        <b>箱入數：</b>
        ${item.carton_qty}
        `;

}



async function convertCSV() {

    const file =
        document
        .getElementById("csvFile")
        .files[0];

    if (!file) {

        alert("請選擇 CSV");

        return;

    }

    document.getElementById("result").innerHTML =
        "讀取 CSV 中...";

    const reader =
        new FileReader();

    reader.onload = function (e) {

        const decoder =
            new TextDecoder("big5");

        const csvText =
            decoder.decode(
                e.target.result
            );

        const rows =
            csvText
            .split(/\r\n|\n|\r/)
            .filter(
                x =>
                    x.trim() !== ""
            );

        document.getElementById("result").innerHTML =
        `
        成功讀取

        ${rows.length}

        筆資料
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
