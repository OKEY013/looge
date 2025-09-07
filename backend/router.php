<?php
require 'config.php';
require 'db.php';

$act = $_GET['act'] ?? '';

switch ($act) {
    case 'register':
        require 'api/register.php'; break;
    case 'login':
        require 'api/login.php'; break;
    case 'products':
        require 'api/products.php'; break;
    case 'draw':
        require 'api/draw.php'; break;
    case 'user':
        require 'api/user.php'; break;
    case 'team':
        require 'api/team.php'; break;
    default:
        echo json_encode(['code'=>404, 'msg'=>'Invalid action']);
}