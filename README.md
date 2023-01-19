### deepl-po-translate

# Translate a .PO file using DeepL API
.po file with no translation => .po file with translation!
Translation is autosaved each 30 items if it fails, no worries :) Start it again
Only not translated (empty strings) are going to be translated

## Translate a .po file
```
yarn start --auth-key [YOURKEY] --po-file-path ~/Repos/ora-frontend/app/locales/bg/messages.po --target-lang de
```

## Translate multiple .po files
```
yarn start --auth-key [YOURKEY] --po-directory-path ~/Repos/ora-frontend/app/locales/ --target-lang de,bg
```

### Options:
```
-d, --debug', 'output extra debugging'
-a, --api <api>', 'free or paid api'
'-k, --auth-key <auth_key>', 'auth_key'
'-f, --po-file-path <po_file_path>', '.po File Path'
'-d, --po-directory-path <po_directory_path>', '.po Folders Path' // assuming files are named messages.po
'-l, --target-lang <target_lang>', 'Target language e.g. de | bg,de,gr'
```