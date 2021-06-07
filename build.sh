# Exit if one command fails.
set -e

# Lint and format.
deno lint
deno fmt --check

# Run tests and generate coverage profile.
deno test \
--allow-read=/tmp,mockcli.ts \
--allow-run=deno \
--allow-write=/tmp \
--coverage=.cov

# Print coverage info to stdout.
deno coverage \
--unstable \
.cov

# Delete coverage profile.
rm -rf .cov
