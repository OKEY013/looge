// 简单参数校验工具
module.exports = {
  requireFields(obj, fields) {
    for (const f of fields) {
      if (obj[f] === undefined || obj[f] === null || obj[f] === '') {
        return `缺少参数: ${f}`;
      }
    }
    return null;
  },
  isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
  },
  isString(val) {
    return typeof val === 'string' && val.length > 0;
  }
};
