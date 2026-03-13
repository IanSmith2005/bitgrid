#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════╗
# ║          BitGrid Worker Client — Install Script          ║
# ║       Bitcoin-native compute marketplace (OP_NET)        ║
# ╚══════════════════════════════════════════════════════════╝
# Usage:
#   curl -fsSL https://bitgrid.io/install.sh | bash
#   -- or --
#   chmod +x bitgrid-worker-install.sh && ./bitgrid-worker-install.sh

set -euo pipefail

BITGRID_VERSION="0.4.2"
INSTALL_DIR="$HOME/.bitgrid"
BIN_DIR="/usr/local/bin"
DAEMON_NAME="bitgrid-worker"
REPO_URL="https://github.com/bitgrid-io/worker-client"

# ── Colours ────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[bitgrid]${RESET} $*"; }
success() { echo -e "${GREEN}[bitgrid]${RESET} $*"; }
warn()    { echo -e "${YELLOW}[bitgrid]${RESET} $*"; }
die()     { echo -e "${RED}[bitgrid] ERROR:${RESET} $*" >&2; exit 1; }

banner() {
  echo ""
  echo -e "${BOLD}  ╔══════════════════════════════════╗${RESET}"
  echo -e "${BOLD}  ║  ${CYAN}BitGrid Worker Client v${BITGRID_VERSION}${RESET}${BOLD}    ║${RESET}"
  echo -e "${BOLD}  ║  Bitcoin-native compute node     ║${RESET}"
  echo -e "${BOLD}  ╚══════════════════════════════════╝${RESET}"
  echo ""
}

# ── System checks ──────────────────────────────────────────
check_os() {
  OS=$(uname -s)
  ARCH=$(uname -m)
  case "$OS" in
    Linux)  PLATFORM="linux" ;;
    Darwin) PLATFORM="darwin" ;;
    *)      die "Unsupported OS: $OS. BitGrid worker supports Linux and macOS." ;;
  esac
  case "$ARCH" in
    x86_64)  ARCH_TAG="amd64" ;;
    aarch64|arm64) ARCH_TAG="arm64" ;;
    *) die "Unsupported architecture: $ARCH" ;;
  esac
  info "Detected: ${OS} / ${ARCH}"
}

check_deps() {
  for dep in curl tar jq; do
    command -v "$dep" &>/dev/null || die "Missing dependency: $dep. Install it and re-run."
  done
}

check_docker() {
  if command -v docker &>/dev/null; then
    success "Docker found — sandboxed execution enabled"
    SANDBOX="docker"
  else
    warn "Docker not found — jobs will run in process isolation only"
    warn "Install Docker for full sandboxing: https://docs.docker.com/get-docker/"
    SANDBOX="process"
  fi
}

# ── GPU detection ──────────────────────────────────────────
detect_gpu() {
  GPU_CLASS="cpu"
  GPU_INFO="None"
  if command -v nvidia-smi &>/dev/null; then
    GPU_INFO=$(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | head -1 || echo "NVIDIA GPU")
    GPU_CLASS="gpu"
    success "GPU detected: ${GPU_INFO}"
  elif command -v rocm-smi &>/dev/null; then
    GPU_INFO="AMD GPU (ROCm)"
    GPU_CLASS="gpu"
    success "GPU detected: ${GPU_INFO}"
  else
    info "No GPU detected — registering as CPU-only node"
  fi
}

# ── Install ────────────────────────────────────────────────
install_binary() {
  TARBALL="${DAEMON_NAME}-${BITGRID_VERSION}-${PLATFORM}-${ARCH_TAG}.tar.gz"
  DOWNLOAD_URL="${REPO_URL}/releases/download/v${BITGRID_VERSION}/${TARBALL}"

  info "Downloading BitGrid worker daemon v${BITGRID_VERSION}..."
  mkdir -p "$INSTALL_DIR"
  # In production this fetches the real binary:
  # curl -fsSL "$DOWNLOAD_URL" -o "/tmp/${TARBALL}"
  # tar -xzf "/tmp/${TARBALL}" -C "$INSTALL_DIR"
  # sudo cp "${INSTALL_DIR}/${DAEMON_NAME}" "${BIN_DIR}/${DAEMON_NAME}"

  # Demo install — create a stub for now
  cat > "${INSTALL_DIR}/${DAEMON_NAME}" <<'STUB'
#!/usr/bin/env bash
echo "BitGrid worker daemon v0.4.2"
echo "Run: bitgrid-worker start --wallet <your-btc-address>"
STUB
  chmod +x "${INSTALL_DIR}/${DAEMON_NAME}"
  sudo ln -sf "${INSTALL_DIR}/${DAEMON_NAME}" "${BIN_DIR}/${DAEMON_NAME}" 2>/dev/null || \
    ln -sf "${INSTALL_DIR}/${DAEMON_NAME}" "$HOME/.local/bin/${DAEMON_NAME}" 2>/dev/null || true

  success "Worker daemon installed to ${INSTALL_DIR}/${DAEMON_NAME}"
}

write_config() {
  CONFIG_FILE="${INSTALL_DIR}/config.toml"
  info "Writing default configuration to ${CONFIG_FILE}..."
  cat > "$CONFIG_FILE" <<TOML
# BitGrid Worker Configuration
# Edit this file before running the daemon.

[node]
alias         = "my-bitgrid-node"
hardware_class = "${GPU_CLASS}"
sandbox       = "${SANDBOX}"

[network]
rpc_url       = "https://api.opnet.org"
network       = "mainnet"              # or "testnet"

[wallet]
# Your Bitcoin address for receiving BTC payouts
# The worker client NEVER has access to your private key.
payout_address = ""                    # REQUIRED — fill this in

[jobs]
max_concurrent  = 2
job_types       = ["ai", "render", "data", "research"]
min_budget_sats = 50000               # ignore jobs below this budget
gpu_only        = ${GPU_CLASS == 'gpu' && false || false}

[logging]
level = "info"
file  = "${INSTALL_DIR}/worker.log"
TOML
  success "Config written — edit ${CONFIG_FILE} before starting"
}

print_next_steps() {
  echo ""
  echo -e "${BOLD}  ─── Setup complete ───────────────────────────────────${RESET}"
  echo ""
  echo -e "  ${GREEN}1.${RESET} Set your BTC payout address in:"
  echo -e "     ${CYAN}${INSTALL_DIR}/config.toml${RESET}"
  echo ""
  echo -e "  ${GREEN}2.${RESET} Start the worker daemon:"
  echo -e "     ${CYAN}${DAEMON_NAME} start${RESET}"
  echo ""
  echo -e "  ${GREEN}3.${RESET} Register your hardware profile on-chain:"
  echo -e "     ${CYAN}${DAEMON_NAME} register --wallet <your-btc-address>${RESET}"
  echo ""
  echo -e "  ${GREEN}4.${RESET} View available jobs and start earning:"
  echo -e "     ${CYAN}${DAEMON_NAME} jobs list${RESET}"
  echo ""
  echo -e "  Docs:  ${CYAN}https://docs.bitgrid.io/worker${RESET}"
  echo -e "  Forum: ${CYAN}https://discord.gg/bitgrid${RESET}"
  echo ""
}

# ── Main ───────────────────────────────────────────────────
main() {
  banner
  check_os
  check_deps
  check_docker
  detect_gpu
  install_binary
  write_config
  print_next_steps
}

main "$@"
