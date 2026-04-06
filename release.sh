#!/usr/bin/env bash
set -e

CURRENT=$(jq -r '.version' manifest.json)
MAJOR=$(echo "$CURRENT" | cut -d. -f1)
MINOR=$(echo "$CURRENT" | cut -d. -f2)
PATCH=$(echo "$CURRENT" | cut -d. -f3)
VERSION="$MAJOR.$MINOR.$((PATCH + 1))"

echo "Bumping $CURRENT -> $VERSION"

# Update version in manifest.json and package.json
tmp=$(mktemp)
jq --arg v "$VERSION" '.version = $v' manifest.json > "$tmp" && mv "$tmp" manifest.json
jq --arg v "$VERSION" '.version = $v' package.json > "$tmp" && mv "$tmp" package.json

git add manifest.json package.json
git commit -m "chore: release $VERSION"
git tag "$VERSION"
git push && git push --tags

echo "Released $VERSION"
