const fs = require('fs');
const path = require('path');

// 1. 读取数据库
const jsonPath = path.join(__dirname, '../src/data/schools.json');
try {
  const schools = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  // 2. 获取要查询的学校名（从命令行参数）
  const targetName = process.argv[2]; 

  if (!targetName) {
    console.log("❌ 请输入学校名称，例如: node scripts/query.cjs 四川大学");
    process.exit(1);
  }

  // 3. 查找逻辑
  const school = schools.find(s => s.name === targetName);

  console.log("\n🔍 查询结果：");
  console.log("------------------------");
  if (school) {
    console.log(`🏫 学校：${school.name}`);
    console.log(`📊 保研率：${school.rate}`);
    console.log(`🏷️  标签：${school.tags ? school.tags.join(', ') : '无'}`);
    console.log(`🔗 来源：${school.source}`);
  } else {
    console.log(`❌ 未找到 "${targetName}" 的数据`);
    console.log("💡 建议：请检查校名是否正确，或者在 App.tsx 的 FORCE_PATCH 中手动添加它。");
  }
  console.log("------------------------\n");

} catch (e) {
  console.error("无法读取数据库文件，请确认 src/data/schools.json 存在。", e.message);
}
