导入说明

1) 推荐导入文件
- MySQL 8 请导入：schema.mysql8.sql（已处理 `user` 保留字、并补齐 message.type 与 team 的返利字段）
- 旧版 MySQL 可导入：schema.sql（如遇 `user` 表报错，请改为 `CREATE TABLE `user` ...`）

2) 命令行导入示例
mysql -h localhost -u <用户> -p<密码> <数据库名> < /var/www/Looge-h5-app/database/schema.mysql8.sql

3) 导入后验证
- SHOW TABLES; 应包含：admin, finance, group, group_record, message, prize, product, team, user
- SHOW COLUMNS FROM message; 应包含 type 字段
- SHOW COLUMNS FROM team; 应包含 rebate_level1/2/3 字段
