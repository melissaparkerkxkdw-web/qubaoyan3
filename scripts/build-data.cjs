const fs = require('fs');
const path = require('path');

const PATHS = {
  rateCsv: path.join(__dirname, '../data/rate.csv'),
  qualCsv: path.join(__dirname, '../data/qual.csv'),
  outputJson: path.join(__dirname, '../src/data/schools.json')
};

const PATCH = { 
  "西安工业大学": { rate: "4.0%", source: "官网公示", tag: "双非" } 
};

function build() {
  console.log("🚀 正在转换数据...");
  const db = {};

  if (fs.existsSync(PATHS.rateCsv)) {
    const content = fs.readFileSync(PATHS.rateCsv, 'utf-8');
    const rows = content.split('\n').map(r => r.split(','));
    rows.slice(2).forEach(row => {
      const name = (row[2] || '').trim();
      if (name) {
        db[name] = { 
          name, 
          rate: (row[5] || row[8] || '').trim() || "暂无", 
          source: "表格数据", 
          tags: [] 
        };
      }
    });
  }

  if (fs.existsSync(PATHS.qualCsv)) {
    const qualContent = fs.readFileSync(PATHS.qualCsv, 'utf-8');
    qualContent.split(/[,，\n]/).forEach(name => {
      const n = name.trim();
      if (n.length > 2 && !db[n]) {
        db[n] = { name: n, rate: null, source: "公示名单", tags: ["保研资格"] };
      }
    });
  }

  Object.keys(PATCH).forEach(name => {
    if (!db[name]) db[name] = { name, tags: [] };
    Object.assign(db[name], PATCH[name]);
  });

  fs.writeFileSync(PATHS.outputJson, JSON.stringify(Object.values(db), null, 2));
  console.log("🎉 搞定！数据已生成到 src/data/schools.json");
}
build();
