#!/usr/bin/env bash

# Define the output file path
OUTPUT_FILE="$HOME/hardware_audit_receipt.txt"

# Ensure the script is run with sudo privileges
if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: Please run this script with sudo (e.g., sudo bash audit.sh)"
  exit 1
fi

echo "🔍 Gathering system hardware signatures..."

# Start creating the receipt
{
  echo "=================================================="
  echo "         PRE-REPAIR HARDWARE AUDIT RECEIPT        "
  echo "         Generated on: $(date)"
  echo "=================================================="
  echo ""

  echo "[1] SYSTEM & MOTHERBOARD IDENTIFICATION"
  echo "--------------------------------------------------"
  dmidecode -t system -t baseboard | grep -E "Manufacturer|Product Name|Serial Number|UUID|Version" | grep -v "Not Specified"
  echo ""

  echo "[2] STORAGE DRIVES (SSD / HDD)"
  echo "--------------------------------------------------"
  lsblk -d -o NAME,MODEL,SERIAL,SIZE,TRAN
  echo ""

  echo "[3] MEMORY MODULES (RAM)"
  echo "--------------------------------------------------"
  dmidecode -t memory | grep -E "Size|Locator|Type|Speed|Manufacturer|Serial Number" | grep -E -v "No Module|Unknown"
  echo ""

  echo "[4] PROCESSOR (CPU)"
  echo "--------------------------------------------------"
  lscpu | grep -E "Model name|Architecture|CPU\(s\):|Thread\(s\) per core|Core\(s\) per socket"
  echo ""

  echo "[5] GRAPHICS & AUDIO CARDS (PCI Devices)"
  echo "--------------------------------------------------"
  lspci -nn | grep -E -i "vga|3d|audio"
  echo ""

  echo "[6] NETWORK & WI-FI CONTROLLERS"
  echo "--------------------------------------------------"
  lspci -nn | grep -E -i "ethernet|network|wireless"
  echo ""

  echo "================================================--"
  echo "                 END OF REPORT                    "
  echo "================================================--"
} > "$OUTPUT_FILE"

echo "✅ Success! Your hardware audit has been saved to:"
echo "👉 $OUTPUT_FILE"
echo "Make sure to copy this file to an external USB drive or email it to yourself!"
