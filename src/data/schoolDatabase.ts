// 官方保研率数据库
// 数据来源：教育部公示及各高校教务处公开数据
export interface SchoolStat {
  rank: number;
  province: string;
  totalStudents: number;
  admissionQuota: number;
  rate: string; // "XX.XX%"
}

export const SCHOOL_DATABASE: Record<string, SchoolStat> = {
  "北京大学": { rank: 1, province: "北京", totalStudents: 3804, admissionQuota: 2117, rate: "55.65%" },
  "中国科学院大学": { rank: 2, province: "北京", totalStudents: 341, admissionQuota: 178, rate: "52.20%" },
  "中国科学技术大学": { rank: 3, province: "安徽", totalStudents: 1927, admissionQuota: 1047, rate: "54.33%" },
  "中国人民大学": { rank: 4, province: "北京", totalStudents: 2781, admissionQuota: 1437, rate: "51.67%" },
  "南京大学": { rank: 5, province: "江苏", totalStudents: 3180, admissionQuota: 1538, rate: "48.37%" },
  "上海交通大学": { rank: 6, province: "上海", totalStudents: 3959, admissionQuota: 1858, rate: "46.93%" },
  "复旦大学": { rank: 7, province: "上海", totalStudents: 3568, admissionQuota: 1618, rate: "45.35%" },
  "西安交通大学": { rank: 8, province: "陕西", totalStudents: 6137, admissionQuota: 2368, rate: "38.59%" },
  "同济大学": { rank: 9, province: "上海", totalStudents: 4572, admissionQuota: 1726, rate: "37.75%" },
  "浙江大学": { rank: 10, province: "浙江", totalStudents: 6386, admissionQuota: 2365, rate: "37.03%" },
  "哈尔滨工业大学": { rank: 11, province: "黑龙江", totalStudents: 3998, admissionQuota: 1472, rate: "36.82%" },
  "西北工业大学": { rank: 12, province: "陕西", totalStudents: 4181, admissionQuota: 1538, rate: "36.79%" },
  "北京师范大学": { rank: 13, province: "北京", totalStudents: 2500, admissionQuota: 914, rate: "36.56%" },
  "北京航空航天大学": { rank: 14, province: "北京", totalStudents: 3794, admissionQuota: 1373, rate: "36.19%" },
  "天津大学": { rank: 15, province: "天津", totalStudents: 4676, admissionQuota: 1630, rate: "34.86%" },
  "华中科技大学": { rank: 16, province: "湖北", totalStudents: 6867, admissionQuota: 2307, rate: "33.60%" },
  "武汉大学": { rank: 17, province: "湖北", totalStudents: 6992, admissionQuota: 2341, rate: "33.48%" },
  "南开大学": { rank: 18, province: "天津", totalStudents: 4075, admissionQuota: 1285, rate: "31.53%" },
  "山东大学": { rank: 19, province: "山东", totalStudents: 10173, admissionQuota: 3175, rate: "31.21%" },
  "东南大学": { rank: 20, province: "江苏", totalStudents: 4088, admissionQuota: 1262, rate: "30.87%" },
  "四川大学": { rank: 21, province: "四川", totalStudents: 8947, admissionQuota: 2715, rate: "30.35%" },
  "厦门大学": { rank: 22, province: "福建", totalStudents: 5200, admissionQuota: 1569, rate: "30.17%" },
  "电子科技大学": { rank: 23, province: "四川", totalStudents: 4955, admissionQuota: 1488, rate: "30.03%" },
  "中国农业大学": { rank: 24, province: "北京", totalStudents: 3450, admissionQuota: 1024, rate: "29.68%" },
  "华东师范大学": { rank: 25, province: "上海", totalStudents: 3671, admissionQuota: 1086, rate: "29.58%" },
  "中山大学": { rank: 26, province: "广东", totalStudents: 7575, admissionQuota: 2240, rate: "29.57%" },
  "兰州大学": { rank: 27, province: "甘肃", totalStudents: 4323, admissionQuota: 1215, rate: "28.11%" },
  "中南大学": { rank: 28, province: "湖南", totalStudents: 8333, admissionQuota: 2333, rate: "28.00%" },
  "北京理工大学": { rank: 29, province: "北京", totalStudents: 3700, admissionQuota: 1036, rate: "28.00%" },
  "湖南大学": { rank: 30, province: "湖南", totalStudents: 5218, admissionQuota: 1417, rate: "27.16%" },
  "吉林大学": { rank: 31, province: "吉林", totalStudents: 10189, admissionQuota: 2642, rate: "25.93%" },
  "重庆大学": { rank: 32, province: "重庆", totalStudents: 6140, admissionQuota: 1582, rate: "25.77%" },
  "大连理工大学": { rank: 33, province: "辽宁", totalStudents: 6183, admissionQuota: 1583, rate: "25.60%" },
  "东北大学": { rank: 34, province: "辽宁", totalStudents: 4866, admissionQuota: 1215, rate: "24.97%" },
  "西北农林科技大学": { rank: 35, province: "陕西", totalStudents: 5262, admissionQuota: 1297, rate: "24.65%" },
  "华南理工大学": { rank: 36, province: "广东", totalStudents: 6157, admissionQuota: 1500, rate: "24.36%" },
  "中国海洋大学": { rank: 37, province: "山东", totalStudents: 3824, admissionQuota: 914, rate: "23.90%" },
  "中央民族大学": { rank: 38, province: "北京", totalStudents: 2850, admissionQuota: 663, rate: "23.26%" },
  "北京科技大学": { rank: 39, province: "北京", totalStudents: 3450, admissionQuota: 800, rate: "23.19%" },
  "西安电子科技大学": { rank: 40, province: "陕西", totalStudents: 5543, admissionQuota: 1238, rate: "22.33%" },
  "北京邮电大学": { rank: 41, province: "北京", totalStudents: 3650, admissionQuota: 814, rate: "22.30%" },
  "中国政法大学": { rank: 42, province: "北京", totalStudents: 2150, admissionQuota: 473, rate: "22.00%" },
  "对外经济贸易大学": { rank: 43, province: "北京", totalStudents: 2160, admissionQuota: 470, rate: "21.76%" },
  "中国地质大学（北京）": { rank: 44, province: "北京", totalStudents: 2050, admissionQuota: 445, rate: "21.71%" },
  "上海科技大学": { rank: 45, province: "上海", totalStudents: 437, admissionQuota: 94, rate: "21.51%" },
  "哈尔滨工程大学": { rank: 46, province: "黑龙江", totalStudents: 3950, admissionQuota: 843, rate: "21.34%" },
  "北京交通大学": { rank: 47, province: "北京", totalStudents: 4150, admissionQuota: 875, rate: "21.08%" },
  "南京理工大学": { rank: 48, province: "江苏", totalStudents: 4050, admissionQuota: 850, rate: "20.99%" },
  "南京航空航天大学": { rank: 49, province: "江苏", totalStudents: 4600, admissionQuota: 960, rate: "20.87%" },
  "华东理工大学": { rank: 50, province: "上海", totalStudents: 4100, admissionQuota: 840, rate: "20.49%" },
  "西南交通大学": { rank: 51, province: "四川", totalStudents: 7400, admissionQuota: 1500, rate: "20.27%" },
  "武汉理工大学": { rank: 52, province: "湖北", totalStudents: 9000, admissionQuota: 1800, rate: "20.00%" },
  "北京化工大学": { rank: 53, province: "北京", totalStudents: 3850, admissionQuota: 760, rate: "19.74%" },
  "东华大学": { rank: 54, province: "上海", totalStudents: 3550, admissionQuota: 690, rate: "19.44%" },
  "河海大学": { rank: 55, province: "江苏", totalStudents: 5100, admissionQuota: 980, rate: "19.22%" },
  "中国传媒大学": { rank: 56, province: "北京", totalStudents: 2300, admissionQuota: 440, rate: "19.13%" },
  "上海外国语大学": { rank: 57, province: "上海", totalStudents: 1500, admissionQuota: 285, rate: "19.00%" },
  "暨南大学": { rank: 58, province: "广东", totalStudents: 4500, admissionQuota: 850, rate: "18.89%" },
  "苏州大学": { rank: 59, province: "江苏", totalStudents: 6600, admissionQuota: 1240, rate: "18.79%" },
  "上海大学": { rank: 60, province: "上海", totalStudents: 4800, admissionQuota: 890, rate: "18.54%" },
  "北京工业大学": { rank: 61, province: "北京", totalStudents: 3300, admissionQuota: 600, rate: "18.18%" },
  "南方科技大学": { rank: 62, province: "广东", totalStudents: 1000, admissionQuota: 180, rate: "18.00%" },
  "首都师范大学": { rank: 63, province: "北京", totalStudents: 2600, admissionQuota: 450, rate: "17.31%" },
  "南京师范大学": { rank: 64, province: "江苏", totalStudents: 4200, admissionQuota: 710, rate: "16.90%" },
  "华中师范大学": { rank: 65, province: "湖北", totalStudents: 4500, admissionQuota: 760, rate: "16.89%" },
  "东北师范大学": { rank: 66, province: "吉林", totalStudents: 3600, admissionQuota: 600, rate: "16.67%" },
  "陕西师范大学": { rank: 67, province: "陕西", totalStudents: 4600, admissionQuota: 750, rate: "16.30%" },
  "西南大学": { rank: 68, province: "重庆", totalStudents: 9800, admissionQuota: 1580, rate: "16.12%" },
  "福州大学": { rank: 69, province: "福建", totalStudents: 6000, admissionQuota: 950, rate: "15.83%" },
  "南昌大学": { rank: 70, province: "江西", totalStudents: 8500, admissionQuota: 1300, rate: "15.29%" },
  "郑州大学": { rank: 71, province: "河南", totalStudents: 11000, admissionQuota: 1650, rate: "15.00%" },
  "云南大学": { rank: 72, province: "云南", totalStudents: 4200, admissionQuota: 600, rate: "14.29%" },
  "西北大学": { rank: 73, province: "陕西", totalStudents: 3300, admissionQuota: 470, rate: "14.24%" },
  "深圳大学": { rank: 74, province: "广东", totalStudents: 7000, admissionQuota: 980, rate: "14.00%" },
  "安徽大学": { rank: 75, province: "安徽", totalStudents: 5800, admissionQuota: 800, rate: "13.79%" },
  "湖南师范大学": { rank: 76, province: "湖南", totalStudents: 5500, admissionQuota: 750, rate: "13.64%" },
  "华南师范大学": { rank: 77, province: "广东", totalStudents: 6800, admissionQuota: 900, rate: "13.24%" },
  "上海财经大学": { rank: 78, province: "上海", totalStudents: 1950, admissionQuota: 250, rate: "12.82%" },
  "中央财经大学": { rank: 79, province: "北京", totalStudents: 2450, admissionQuota: 310, rate: "12.65%" },
  "中国药科大学": { rank: 80, province: "江苏", totalStudents: 2700, admissionQuota: 340, rate: "12.59%" },
  "广州医科大学": { rank: 110, province: "广东", totalStudents: 2100, admissionQuota: 180, rate: "8.57%" },
  "燕山大学": { rank: 120, province: "河北", totalStudents: 5800, admissionQuota: 450, rate: "7.76%" },
};

// 辅助函数：模糊匹配学校名称，确保用户输入"北航"也能匹配到"北京航空航天大学"
export const getSchoolData = (inputName: string): SchoolStat | null => {
  const normalizedInput = inputName.trim();
  
  // 1. 精确匹配
  if (SCHOOL_DATABASE[normalizedInput]) {
    return SCHOOL_DATABASE[normalizedInput];
  }

  // 2. 常见别名匹配
  const aliases: Record<string, string> = {
    "北航": "北京航空航天大学",
    "北理工": "北京理工大学",
    "哈工大": "哈尔滨工业大学",
    "西工大": "西北工业大学",
    "中科大": "中国科学技术大学",
    "人大": "中国人民大学",
    "武大": "武汉大学",
    "华科": "华中科技大学",
    "上交": "上海交通大学",
    "复旦": "复旦大学",
    "浙大": "浙江大学",
    "南大": "南京大学",
    "西交": "西安交通大学"
  };

  if (aliases[normalizedInput]) {
    return SCHOOL_DATABASE[aliases[normalizedInput]];
  }

  return null;
};
