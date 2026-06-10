
const SUPABASE_URL = "https://vfbxmednhbkcizyjojfc.supabase.co";
const SUPABASE_KEY = "sb_publishable_7ciuMdtTX-PyYVr3PbUGDQ_HGtC1wvp";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let b8Data = [];

window.onload = async function () {
    try {
        const { data, error } = await db.from("products").select("*");
        if (error) throw error;

        b8Data = data;
        document.getElementById("result").innerHTML =
            `成功載入 ${b8Data.length} 筆商品資料`;
    } catch (error) {
        console.error(error);
        document.getElementById("result").innerHTML = "Supabase資料載入失敗";
    }
};

function searchTDC() {
    const tdc = document.getElementById("tdcInput").value.trim();

    const item = b8Data.find(
        x => String(x.tdc).trim() === tdc
    );

    if (!item) {
        document.getElementById("result").innerHTML = "查無資料";
        return;
    }

    document.getElementById("result").innerHTML = `
    <b>TDC：</b>${item.tdc}<br>
    <b>全家代號：</b>${item.family_code}<br>
    <b>日翊代號：</b>${item.riyi_code}<br>
    <b>廠商：</b>${item.vendor_name}<br>
    <b>條碼：</b>${item.barcode}<br>
    <b>箱入數：</b>${item.carton_qty}
    `;
}

function downloadPDF() {
    html2pdf().from(document.getElementById("result")).save("B8入倉通知單.pdf");
}

async function convertCSV() {

    const file =
        document.getElementById("csvFile").files[0];

    if (!file) {

        alert("請選擇 CSV");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const decoder = new TextDecoder("big5");

        const csvText =
            decoder.decode(e.target.result);
console.log(csvText);
       const rows =
    csvText
    .split(/\r\n|\n|\r/)
    .filter(
        x => x.trim() !== ""
    );

       
       const headerIndex = rows.findIndex(
    row => row.includes("序號")
);

console.log("headerIndex =", headerIndex);

const dataRows =
    rows.slice(headerIndex + 1);

console.log(dataRows);

        let csvData = [];

        dataRows.forEach(row => {

            console.log(row);
            
            const cols =
                row.split(",");

            console.log(cols.length, cols);

            if (cols.length < 18)
                return;

            csvData.push({

                productName:
                    cols[2].trim(),

                tdc:
                    cols[3].trim(),

                cartonQty:
                    Number(cols[7]) || 0,

                center:
                    cols[16].trim(),

                deliveryDate:
                    cols[17].trim()

            });

        });

        console.log(csvData);

        document.getElementById(
            "result"
        ).innerHTML =
            `成功讀取 ${csvData.length} 筆 CSV 資料`;

    };

    reader.readAsArrayBuffer(file);

}
