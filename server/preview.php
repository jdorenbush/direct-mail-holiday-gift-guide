<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON request.']);
    exit;
}

$sender = trim((string)($data['sender'] ?? ''));
$reply = trim((string)($data['reply'] ?? ''));
$recipient = trim((string)($data['recipient'] ?? ''));
$items = $data['items'] ?? [];

if ($sender === '' || mb_strlen($sender) > 80) {
    respondError('Enter a valid sender name.');
}
if (!filter_var($reply, FILTER_VALIDATE_EMAIL) || strlen($reply) > 254) {
    respondError('Enter a valid reply-to email address.');
}
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL) || strlen($recipient) > 254) {
    respondError('Enter a valid recipient email address.');
}
if (!is_array($items) || count($items) < 1 || count($items) > 20) {
    respondError('Select between 1 and 20 products.');
}

$allowedProducts = [
    'APP-101' => ['brand' => 'Northstar Apparel', 'name' => 'Summit Fleece Jacket', 'price' => 59.98],
    'APP-204' => ['brand' => 'Northstar Apparel', 'name' => 'Performance Polo', 'price' => 37.98],
    'BAG-310' => ['brand' => 'Field & Carry', 'name' => 'Commuter Backpack', 'price' => 68.00],
    'BAG-422' => ['brand' => 'Field & Carry', 'name' => 'Canvas Weekender', 'price' => 82.00],
    'ACC-118' => ['brand' => 'Cedar Works', 'name' => 'Insulated Travel Tumbler', 'price' => 24.50],
    'ACC-227' => ['brand' => 'Cedar Works', 'name' => 'Knit Cuff Beanie', 'price' => 18.75],
];

$validatedItems = [];
foreach ($items as $item) {
    $id = is_array($item) ? (string)($item['id'] ?? '') : '';
    if (!isset($allowedProducts[$id])) {
        respondError('One or more products are invalid.');
    }
    $validatedItems[$id] = ['id' => $id] + $allowedProducts[$id];
}

$safeSender = htmlspecialchars($sender, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$subject = 'Holiday Gift Guide Favorites from ' . $sender;
$html = '<div style="font-family:Arial,sans-serif;max-width:640px">';
$html .= '<h1 style="font-size:22px">Holiday Gift Guide Favorites</h1>';
$html .= '<p>Shared by <strong>' . $safeSender . '</strong>.</p>';

foreach (array_values($validatedItems) as $index => $item) {
    $html .= '<div style="border-top:1px solid #ddd;padding:16px 0">';
    $html .= '<strong>Item #' . ($index + 1) . ': ' . escape($item['name']) . '</strong><br>';
    $html .= escape($item['brand']) . '<br>';
    $html .= 'SKU: ' . escape($item['id']) . '<br>';
    $html .= 'Price: $' . number_format((float)$item['price'], 2);
    $html .= '</div>';
}
$html .= '</div>';

echo json_encode([
    'recipient' => $recipient,
    'reply' => $reply,
    'subject' => $subject,
    'html' => $html,
    'delivery' => 'disabled',
], JSON_UNESCAPED_SLASHES);

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function respondError(string $message): never
{
    http_response_code(422);
    echo json_encode(['error' => $message]);
    exit;
}
