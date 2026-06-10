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
