
# SafeChara Backend — Tomorrow Prototype

## 1. Install

```bash
python -m venv venv
```

Windows:
```bash
venv\Scripts\activate
```

macOS/Linux:
```bash
source venv/bin/activate
```

Then:
```bash
pip install -r requirements.txt
```

## 2. Run

```bash
python app.py
```

The backend runs on:

http://127.0.0.1:5000

For a phone on the same Wi-Fi, use the computer's LAN IP:

http://YOUR-PC-IP:5000

## 3. API

POST:

`/api/analyze`

Multipart fields:

- image = feed photo
- animal = Cow / Buffalo
- condition = Normal / Lactating / Pregnant

Example:

```bash
curl -X POST http://127.0.0.1:5000/api/analyze \
  -F "image=@feed.jpg" \
  -F "animal=Cow" \
  -F "condition=Normal"
```

## 4. Response

The JSON contains:

- visual quality score
- mould indicator
- sand/foreign-particle indicator
- insect/pest indicator
- animal
- condition
- recommendation
- image-processing features

## IMPORTANT FOR TOMORROW

This is a prototype visual-screening backend.

It is NOT a trained feed-quality model.

It does NOT scientifically measure:
protein, fibre, energy, minerals, urea, aflatoxin, mycotoxins, or chemical adulteration.

For the demonstration, visible sand/foreign particles can trigger CAUTION.
Mould and insect detection are intentionally conservative placeholders unless
you later add a trained detector.

Final architecture:
phone camera + sensors + 10-wavelength IR + photodiode + ESP32 +
laboratory reference labels + calibrated ML + rule-based advisory.
