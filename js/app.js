const SUPABASE_URL =
    "https://vfbxmednhbkcizyjojfc.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_7ciuMdtTX-PyYVr3PbUGDQ_HGtC1wvp";

const db =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

let b8Data = [];

window.onload = async function () {

    try {

        const { data, error } =
            await db
                .from("products")
                .select("*");

        if (error) throw error;

        b8Data = data;

        document.getElementById("result").innerHTML =
            `成功載入 ${b8Data.length} 筆商品資料`;

    } catch (error) {

        console.error(error);

        document.getElementById("result").innerHTML =
            "Supabase資料載入失敗";
    }

};

function searchTDC() {

    const tdc =
        document
            .getElementById("tdcInput")
            .value
            .trim();

    const item =
        b8Data.find(
            x => String(x.tdc).trim() === tdc
        );

    if (!item) {

        document.getElementById("result").innerHTML =
            "查無資料";

        return;
    }

    document.getElementById("result").innerHTML =

        `
        <b>TDC：</b>${item.tdc}<br>
        <b>全家代號：</b>${item.family_code}<br>
        <b>日翊代號：</b>${item.riyi_code}<br>
        <b>期數：</b>${item.period}<br>
        <b>廠商代號：</b>${item.vendor_code}<br>
        <b>廠商Email：</b>${item.vendor_email}<br>
        <b>國際條碼：</b>${item.barcode}<br>
        <b>箱入數：</b>${item.carton_qty}
        `;
}

function convertCSV() {

    const file =
        document
            .getElementById("csvFile")
            .files[0];

    if (!file) {

        alert("請先選擇CSV檔");

        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const text = e.target.result;

        const lines =
            text.split(/\r?\n/);

        let resultHtml =
            `<b>CSV檔案：</b>${file.name}<br><br>`;

        let foundCount = 0;

        for (let line of lines) {

            if (!line.includes(",")) continue;

            const cols =
                line.split(",");

            const tdc =
                cols.find(c =>
                    /^\d{7,10}$/.test(
                        c.replace(/"/g, "").trim()
                    )
                );

            if (!tdc) continue;

            const cleanTDC =
                tdc.replace(/"/g, "").trim();

            const item =
                b8Data.find(
                    x =>
                        String(x.tdc).trim() === cleanTDC
                );

            if (!item) continue;

            foundCount++;

            resultHtml += `
                <hr>
                TDC：${item.tdc}<br>
                全家代號：${item.family_code}<br>
                日翊代號：${item.riyi_code}<br>
                廠商代號：${item.vendor_code}<br>
                廠商Email：${item.vendor_email}<br>
                國際條碼：${item.barcode}<br>
                箱入數：${item.carton_qty}<br>
            `;
        }

        resultHtml =
            `<b>成功比對：</b>${foundCount} 筆<br><br>`
            + resultHtml;

        document.getElementById("result").innerHTML =
            resultHtml;
    };

    reader.readAsText(file, "utf-8");
}
