<?php
$host = "localhost";
$usuario = "root";
$senha = ""; // normalmente vazio no XAMPP
$banco = "ecorecicla";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}
?>
