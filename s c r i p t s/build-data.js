const fs = require('fs');
const path = require('path');

// ================== 配置区域 ==================

// 这里对应你刚才建好的 data 文件夹结构
const PATHS = {
  // 脚本在 scripts/ 里，所以用 ../data/ 往上一层找
  rateCsv: path.join(__dirname, '../data/rate.csv'),
  qualCsv: path.join(__dirname, '../data/qual.csv'),
  // 输出到 src/data/schools.json 供前端使用
  outputJson: path.join(__dirname, '../src/data/schools.json') 
};

// 官网数据补丁 (你可以随时在这里加学校)
const OFFICIAL_PATCH = {
  "西安工业大学": {
    rate: "4.0%",
    source: "2025届教务处公示",
    tag: "双非"
  },
  "陕西科技大学": {
    rate: "4.5%",
    source: "2024届官网数据",
    tag: "双非"
  }
};

// ================== 核心逻辑 ==================

function parseCSV(content) {
  return content.split(/\r?\n/).filter(line => line.trim() !== '').map(line => line.split(','));
}

function build() {
  console.log("🚀 开始构建数据库...");
  const database = {};

  // 1. 读取保研率 (rate.csv)
  try {
    const rateRows = parseCSV(fs.readFileSync(PATHS.rateCsv, 'utf-8'));
    // 跳过前2行标题
    for (let i = 2; i < rateRows.length; i++) {
      const row = rateRows[i];
      if (!row || row.length < 5) continue;
      const name = (row[2] || '').trim();
      if (!name) continue;

      let rate = (row[5] || '').trim(); // 2025
      let source = "2025届";
      if (!rate || rate === 'NaN') {
        rate = (row[8] || '').trim(); // 2024
        source = "2024届";
      }
      
      if (rate && rate !== 'NaN') {
        database[name] = { name, rate, source, from_official: false, tags: [] };
      }
    }
    console.log(`✅ 解析保研率完成`);
  } catch (e) { console.log("⚠️ 没找到 rate.csv，跳过"); }

  // 2. 读取资格 (qual.csv)
  try {
    const qualContent = fs.readFileSync(PATHS.qualCsv, 'utf-8');
    const qualNames = qualContent.split(/[,，\n\r]+/).map(s => s.trim()).filter(s => s.length > 2);
    qualNames.forEach(name => {
      if (!database[name]) {
        // 关键：没数据的学校，rate 留空！
        database[name] = { name, rate: null, source: null, from_official: false, tags: [] };
      }
      if (!database[name].tags.includes("保研资格")) database[name].tags.push("保研资格");
    });
    console.log(`✅ 解析资格表完成`);
  } catch (e) { console.log("⚠️ 没找到 qual.csv，跳过"); }

  // 3. 应用补丁
  Object.keys(OFFICIAL_PATCH).forEach(name => {
    const patch = OFFICIAL_PATCH[name];
    if (!database[name]) database[name] = { name, tags: [] };
    database[name].rate = patch.rate;
    database[name].source = patch.source;
    database[name].from_official = true;
    if (patch.tag) database[name].tags.push(patch.tag);
  });

  // 4. 写入文件
  // 自动创建输出目录
  const outDir = path.dirname(PATHS.outputJson);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(PATHS.outputJson, JSON.stringify(Object.values(database), null, 2));
  console.log(`🎉 成功！数据已生成到: ${PATHS.outputJson}`);
}

build();
