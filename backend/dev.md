Start api:

```bash
cargo watch -q -x 'run -p api'
```

Generate db sea-orm entities:

```bash
sea-orm-cli generate entity -o entity/src
```
