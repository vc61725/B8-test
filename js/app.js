
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

    }
    catch (error) {

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
            x =>
                String(x.tdc).trim() === tdc
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
        <b>廠商：</b>${item.vendor_name}<br>
        <b>廠商代號：</b>${item.vendor_code}<br>
        <b>Email：</b>${item.vendor_email}<br>
        <b>條碼：</b>${item.barcode}<br>
        <b>箱入數：</b>${item.carton_qty}
        `;

}


function convertCSV() {

    const file =
        document
            .getElementById("csvFile")
            .files[0];

    if (!file) {

        alert("請先選擇CSV");

        return;

    }

    const reader =
        new FileReader();

    reader.onload = function (e) {

        const text =
            e.target.result;

        const lines =
            text.split(/\r?\n/);

        let startIndex = -1;

        for (let i = 0; i < lines.length; i++) {

            if (
                lines[i].includes("序號") &&
                lines[i].includes("品代")
            ) {

                startIndex = i + 1;
                break;

            }

        }

        if (startIndex === -1) {

            document.getElementById("result").innerHTML =
                "找不到資料區";

            return;

        }

        let vendorGroups = {};

        let missingList = [];

        for (let i = startIndex; i < lines.length; i++) {

            if (lines[i].trim() === "")
                continue;

            const cols =
                lines[i].split(",");

            if (cols.length < 9)
                continue;

            const seqNo =
                cols[0].replace(/"/g, "").trim();

            const acceptNo =
                cols[1].replace(/"/g, "").trim();

            const productName =
                cols[2].replace(/"/g, "").trim();

            const tdc =
                cols[3].replace(/"/g, "").trim();

            const spec =
                cols[5].replace(/"/g, "").trim();

            const packageQty =
                cols[6].replace(/"/g, "").trim();

            const boxQty =
                cols[7].replace(/"/g, "").trim();

            const totalQty =
                cols[8].replace(/"/g, "").trim();

            const deliveryCenter =
                cols[11]?.replace(/"/g, "").trim() || "";

            const deliveryDate =
                cols[12]?.replace(/"/g, "").trim() || "";

            const item =
                b8Data.find(
                    x =>
                        String(x.tdc).trim() === tdc
                );

            if (!item) {

                missingList.push(tdc);

                continue;

            }

            if (!vendorGroups[item.vendor_code]) {

                vendorGroups[item.vendor_code] = {

                    vendor_name:
                        item.vendor_name,

                    vendor_email:
                        item.vendor_email,

                    deliveryCenter,

                    deliveryDate,

                    items: []

                };

            }

            vendorGroups[item.vendor_code]
                .items
                .push({

                    seqNo,
                    acceptNo,
                    productName,
                    spec,
                    packageQty,
                    tdc,

                    barcode:
                        item.barcode,

                    carton_qty:
                        item.carton_qty,

                    boxQty,

                    totalQty,

                    riyi_code:
                        item.riyi_code

                });

        }

        let resultHtml = "";

        for (const vendorCode in vendorGroups) {

            const vendor =
                vendorGroups[vendorCode];

            resultHtml += `

            <div class="vendor-block">

            <h2>B8 入倉通知單</h2>

            <h3>
            廠商：
            ${vendor.vendor_name}
            </h3>

            <p>
            配送中心：
            ${vendor.deliveryCenter}
            </p>

            <p>
            配送日期：
            ${vendor.deliveryDate}
            </p>

            <table
            border="1"
            cellpadding="8"
            width="100%">

            <tr>

            <th>序號</th>
            <th>訂貨驗收單</th>
            <th>品名</th>
            <th>規格</th>
            <th>包裝數</th>
            <th>TDC</th>
            <th>日翊代號</th>
            <th>國際條碼</th>
            <th>箱入數</th>
            <th>訂購箱數</th>
            <th>訂購總數</th>

            </tr>

            `;

            vendor.items.forEach(product => {

                resultHtml += `

                <tr>

                <td>${product.seqNo}</td>
                <td>${product.acceptNo}</td>
                <td>${product.productName}</td>
                <td>${product.spec}</td>
                <td>${product.packageQty}</td>
                <td>${product.tdc}</td>
                <td>${product.riyi_code}</td>
                <td>${product.barcode}</td>
                <td>${product.carton_qty}</td>
                <td>${product.boxQty}</td>
                <td>${product.totalQty}</td>

                </tr>

                `;

            });

            resultHtml +=
                "</table><br><br></div>";

        }

        if (missingList.length > 0) {

            resultHtml +=
                `
                <hr>
                <h3>找不到 Mapping 的 TDC：</h3>
                ${missingList.join("<br>")}
                `;

        }

        document.getElementById("result").innerHTML =
            resultHtml;

    };

    reader.readAsText(
        file,
        "utf-8"
    );

}


function downloadPDF() {

    html2pdf()
        .from(
            document.getElementById("result")
        )
        .save("B8入倉通知單.pdf");

}

