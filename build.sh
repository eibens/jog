COV_DIR=".cov"
COV_FILE="mod.lcov"
ALLOW_READ="/tmp,mockcli.ts"
ALLOW_WRITE="/tmp"
ALLOW_RUN="deno"

# Exit if one command fails.
set -e

# Lint and format.
deno lint
deno fmt

# Run tests and generate coverage profile.
deno test \
--allow-read="$ALLOW_READ" \
--allow-run="$ALLOW_RUN" \
--allow-write="$ALLOW_WRITE" \
--coverage="$COV_DIR"

# Print coverage info to stdout.
deno coverage \
--unstable \
"$COV_DIR"

# Write coverage report to file.
deno coverage \
--unstable \
--lcov \
"$COV_DIR" \
> "$COV_FILE"

# Delete coverage profile.
rm -rf "$COV_DIR"

# Delete PWD from file names in coverage report.
# Use @ as separator, so that we can use / unescaped.
sed -i "s@SF:${PWD}/@SF:@" "$COV_FILE"
