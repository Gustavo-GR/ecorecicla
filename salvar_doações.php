<?php
require_once "config/conexao.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nome       = $_POST["nome"] ?? "";
    $email      = $_POST["email"] ?? "";
    $telefone   = $_POST["telefone"] ?? "";
    $tipo_item  = $_POST["tipo_item"] ?? "";
    $quantidade = $_POST["quantidade"] ?? "";
    $coleta     = isset($_POST["coleta"]) ? 1 : 0;
    $endereco   = $_POST["endereco"] ?? null;

    $sql = "INSERT INTO doacoes 
        (nome, email, telefone, tipo_item, quantidade, coleta, endereco)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Erro na preparação: " . $conn->error);
    }

    $stmt->bind_param(
        "sssssis",
        $nome,
        $email,
        $telefone,
        $tipo_item,
        $quantidade,
        $coleta,
        $endereco
    );

    if ($stmt->execute()) {
        echo "Doação registrada com sucesso!";
    } else {
        echo "Erro ao registrar doação.";
    }

    $stmt->close();
    $conn->close();
}
?>
