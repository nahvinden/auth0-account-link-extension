((Get-Content -path node_modules\@auth0\hapi\lib\defaults.js -Raw) -replace 'Os.tmpDir','Os.tmpdir') | Set-Content -Path node_modules\@auth0\hapi\lib\defaults.js