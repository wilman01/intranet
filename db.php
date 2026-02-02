<?php
// Configuración de la base de datos
$host    = 'ec2-13-59-136-5.us-east-2.compute.amazonaws.com/';
$db_name = 'fvf_intranet';
$user    = 'root';
$pass    = 'ww050609*';
$charset = 'utf8mb4';

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    // Creamos la instancia de PDO
    $pdo = new PDO($dsn, $user, $pass, $options);

} catch (PDOException $e) {
    // Si hay error, detenemos todo y mostramos el mensaje
    die("❌ Error de conexión: " . $e->getMessage());
}
?>