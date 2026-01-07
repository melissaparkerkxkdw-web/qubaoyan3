const fs = require('fs');
const path = require('path');

// ================== 配置区域 ==================

// 1. 文件路径配置 (根据实际位置调整)
const PATHS = {
  rateCsv: path.join(__dirname, '../data/rate.csv'),
  qualCsv: path.join(__dirname, '../data/qual.csv'),
  outputJson: path.join(__dirname, '../src/data/schools.json') // 输出到 src 供前端用
};

// 2. 官网数据补丁 (Manual Overrides)
// 逻辑：CSV里没有的，会查这里。如果这里也没有，就强制留空。
// 以后你想加学校，就在这里加一行。
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
  // 在这里继续添加...
};

// ================== 核心逻辑 ==================

// 简单的 CSV 解析器 (处理逗号和引号)
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  return lines.map(line => {
    // 简单的逗号分割，如果单元格内有逗号需更复杂逻辑，这里针对学校数据够用了
    return line.split(','); 
  });
}

function build() {
  console.log("🚀 开始构建学校数据库...");
  const database = {};

  // --- 1. 读取保研率 CSV (rate.csv) ---
  try {
    const rateContent = fs.readFileSync(PATHS.rateCsv, 'utf-8');
    const rateRows = parseCSV(rateContent);
    
    // 跳过前2行标题 (序号行和子标题行)
    // 根据你的 CSV 结构：Index 2=学校, Index 5=2025率, Index 8=2024率
    for (let i = 2; i < rateRows.length; i++) {
      const row = rateRows[i];
      if (!row || row.length < 5) continue;

      const name = (row[2] || '').trim();
      if (!name) continue;

      // 优先取 2025 (Index 5), 其次 2024 (Index 8)
      // 注意：CSV列数可能变化，请检查你的表格列索引
      let rate = (row[5] || '').trim(); 
      let source = "2025届 (CSV)";
      
      if (!rate || rate === '' || rate === 'NaN') {
        rate = (row[8] || '').trim();
        source = "2024届 (CSV)";
      }

      // 如果还是空的，标记无效
      if (!rate || rate === 'NaN') rate = null;

      if (rate) {
        database[name] = {
          name: name,
          rate: rate,
          source: source,
          from_official: false,
          tags: []
        };
      }
    }
    console.log(`✅ 已解析保研率数据，当前收录: ${Object.keys(database).length} 所`);
  } catch (e) {
    console.warn(`⚠️ 未找到或读取 rate.csv 失败: ${e.message}`);
  }

  // --- 2. 读取保研资格 CSV (qual.csv) ---
  try {
    const qualContent = fs.readFileSync(PATHS.qualCsv, 'utf-8');
    // 资格表比较乱，直接把所有非空字符串当做学校名
    const qualNames = qualContent.split(/[,，\n\r]+/)
      .map(s => s.trim())
      .filter(s => s && s !== 'NaN' && s.length > 2 && !s.includes('Unnamed'));

    qualNames.forEach(name => {
      if (!database[name]) {
        // 如果保研率表里没有，这里先占位，数据留空！
        database[name] = {
          name: name,
          rate: null, // <--- 关键：默认空，绝不瞎编
          source: null,
          from_official: false,
          tags: []
        };
      }
      // 打上标签
      if (!database[name].tags.includes("保研资格院校")) {
        database[name].tags.push("保研资格院校");
      }
    });
    console.log(`✅ 已合并保研资格名单，当前总数: ${Object.keys(database).length} 所`);
  } catch (e) {
    console.warn(`⚠️ 未找到或读取 qual.csv 失败: ${e.message}`);
  }

  // --- 3. 应用官网补丁 (OFFICIAL_PATCH) ---
  console.log(`🔍 正在应用 ${Object.keys(OFFICIAL_PATCH).length} 条人工补丁...`);
  
  Object.keys(OFFICIAL_PATCH).forEach(name => {
    const patch = OFFICIAL_PATCH[name];
    
    if (!database[name]) {
      database[name] = { name: name, tags: [] };
    }
    
    // 强制覆盖数据
    database[name].rate = patch.rate;
    database[name].source = `官网人工核实 (${patch.source})`;
    database[name].from_official = true;
    if (patch.tag) database[name].tags.push(patch.tag);
  });

  // --- 4. 导出 ---
  const finalData = Object.values(database);
  
  // 确保输出目录存在
  const outDir = path.dirname(PATHS.outputJson);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(PATHS.outputJson, JSON.stringify(finalData, null, 2));
  console.log(`🎉 数据库生成完毕！已写入: ${PATHS.outputJson}`);
}

build();
