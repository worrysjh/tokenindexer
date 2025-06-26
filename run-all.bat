@echo off
setlocal enabledelayedexpansion

set NETWORK=ethereum
set TOTAL_SHARDS=3

for /L %%i in (0,1,2) do (
  echo Running shard %%i...
  start "shard %%i" node bin/tokenindexer.js --network=%NETWORK% --shard=%%i --total-shards=%TOTAL_SHARDS%
)
