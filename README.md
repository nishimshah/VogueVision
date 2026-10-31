# VogueVision
### Fashion Image Similarity Search and Outfit Matching Using Computer Vision
**Semester 7 Computer Vision Mini-Project**

---

## 1. Project Overview
**VogueVision** is a Computer Vision-powered fashion discovery and outfit recommendation platform. It enables users to upload a clothing photo (or capture one via webcam) to automatically extract color and visual features using actual **OpenCV** algorithms, discover visually similar items from a local fashion catalog, and generate rule-based, coordinated outfit ensembles.

---

## 2. Problem Statement
Traditional fashion search engines rely heavily on textual keywords (e.g., *"pink floral ruffled blouse"*), which fails when users have an image or screenshot of a garment but don't know the exact fashion terminology. 

Furthermore, determining complementary pieces (pairing tops with bottoms, shoes, and accessories) requires understanding chromatic relationships and silhouette harmony. 

**VogueVision** addresses this by using direct pixel-level computer vision analysis:
1. Converting raw images into illumination-invariant color representations.
2. Computing normalized 3D color histograms to match visual style without requiring costly cloud AI APIs.
3. Applying classic fashion color-harmony matrices to curate complete head-to-toe looks.

---

## 3. Project Objectives
- Implement real **OpenCV** image processing algorithms in Python (decoding, resizing, color space conversions).
- Extract normalized **3D HSV Color Histograms** (512 dimensions) to capture garment chromatic distributions.
- Quantize pixel clusters with **OpenCV K-Means** (`cv2.kmeans`) to identify dominant color palettes with surface percentages.
- Perform mathematical image similarity ranking using **Pearson Histogram Correlation** (`cv2.HISTCMP_CORREL`).
- Implement an automated **Rule-Based Fashion Styling Engine** to curate harmonious outfit combinations.
- Build a responsive web application adhering to luxury editorial fashion-tech aesthetics.

---

## 4. Technologies Used

### Frontend
- **React 19** with **Vite**
- **JavaScript (JSX)**
- **Tailwind CSS v4** (Luxury color palette: `#FAF8F7`, `#F5EEF5`, `#211827`, `#7950A3`, `#EDE3F4`, `#E8B5C4`)
- **React Router v7**
- **Lucide React** (Fashion & UI icons)
- **Axios** (API client)

### Backend
- **Python 3.13**
- **Flask** & **Flask-CORS**
- **OpenCV 4.10** (`opencv-python-headless`)
- **NumPy**
- **Pillow**

### Dataset
- 34 curated local fashion products across 7 categories:
  - **Tops & Blouses**
  - **Denim & Jeans**
  - **Tailored Trousers**
  - **Midi & Satin Skirts**
  - **Dresses**
  - **Handbags & Crossbody Bags**
  - **Footwear (Sneakers, Heels, Slides, Mules)**
- All images stored locally on disk (`backend/catalog/product_images/` & `frontend/public/catalog/`).
- Zero paid APIs or external database dependencies.

---

## 5. Computer Vision Algorithms & Methodology

### Step 1: Image Preprocessing
- Raw image byte stream is decoded into OpenCV 3-channel BGR format using `cv2.imdecode`.
- Validates dimensions and image integrity.
- Resizes to standard $256 \times 256$ dimensions using area interpolation (`cv2.INTER_AREA`).
- Converts color space from BGR to RGB and HSV (`cv2.cvtColor`).

### Step 2: HSV Color Space Conversion
RGB combines chromaticity with luminance (lighting intensity). The **HSV** color space decouples:
- **Hue ($H \in [0, 180]$):** The pure color pigment.
- **Saturation ($S \in [0, 255]$):** Vibrancy or color purity.
- **Value ($V \in [0, 255]$):** Brightness / luminance.

This ensures similarity calculations are resilient to shadows and exposure shifts.

### Step 3: 3D Color Histogram Extraction
We compute a joint 3D histogram across all three channels:
- 8 Hue bins $\times$ 8 Saturation bins $\times$ 8 Value bins = **512 total bins**.
- Extracted using `cv2.calcHist([hsv], [0, 1, 2], None, [8, 8, 8], [0, 180, 0, 256, 0, 256])`.
- Normalized using `cv2.normalize(hist, hist, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)`.

### Step 4: Histogram Correlation Matching
Similarity between the query histogram $H_1$ and each catalog item's histogram $H_2$ is computed using **Pearson Correlation**:

$$r(H_1, H_2) = \frac{\sum_k (H_1(k) - \bar{H}_1)(H_2(k) - \bar{H}_2)}{\sqrt{\sum_k (H_1(k) - \bar{H}_1)^2 \sum_k (H_2(k) - \bar{H}_2)^2}}$$

Computed via `cv2.compareHist(q_hist, item_hist, cv2.HISTCMP_CORREL)`. Correlation ranges from $-1.0$ (dissimilar) to $+1.0$ (identical distribution), normalized into a percentage score $[0\%, 100\%]$.

### Step 5: Dominant Color Extraction (K-Means)
Garment pixels are reshaped to an $N \times 3$ matrix and clustered into $K = 4$ dominant color centroids using `cv2.kmeans`. Surface area percentages are derived from label counts:

$$\min \sum_{i=1}^k \sum_{x \in S_i} \|x - \mu_i\|^2$$

### Step 6: Rule-Based Outfit Compatibility
Detected pigments are evaluated against fashion color theory rules:
- **Pink** $\rightarrow$ Light Denim Blue, Cream, White, Beige, Rose
- **Blue / Denim** $\rightarrow$ White, Cream, Camel, Pink, Black
- **Black** $\rightarrow$ White, Grey, Camel, Plum, Emerald
- **Green / Olive** $\rightarrow$ Cream, Ivory, Beige, Tan, Gold
- **Neutrals (White/Cream/Beige)** $\rightarrow$ Universal pairing with all silhouettes

---

## 6. Project Architecture

```
voguevision/
├── backend/
│   ├── app.py                      # Flask API server & endpoint routing
│   ├── requirements.txt            # Python dependencies
│   ├── setup_catalog.py            # Dataset precomputation script
│   ├── cv/
│   │   ├── __init__.py
│   │   ├── preprocessing.py        # Decoding, resize & color space conversions
│   │   ├── color_analysis.py       # cv2.calcHist & cv2.kmeans clustering
│   │   ├── similarity.py           # cv2.compareHist Pearson ranking
│   │   └── outfit_matching.py      # Color harmony rules & outfit curation
│   ├── data/
│   │   └── products.json           # Catalog metadata & 512-D precomputed histograms
│   ├── catalog/
│   │   └── product_images/         # Local JPEG catalog images
│   └── uploads/                    # Temporary uploaded queries
│
├── frontend/
│   ├── index.html                  # Playfair Display & Inter fonts, meta tags
│   ├── vite.config.js              # Vite config with Tailwind & backend proxy
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Routing & state management
│       ├── index.css               # Tailwind CSS v4 design tokens
│       ├── components/
│       │   ├── Navbar.jsx          # Luxury header with active route styling
│       │   ├── Footer.jsx          # Academic CV viva footer
│       │   ├── ProductModal.jsx    # Item details & exact correlation metrics
│       │   └── CameraCaptureModal.jsx # Live webcam snapshot viewfinder
│       ├── pages/
│       │   ├── HomePage.jsx        # Hero, pipeline cards, 1-click sandbox
│       │   ├── ExplorePage.jsx     # Drag-and-drop, 4-step progress, 3-col studio
│       │   ├── OutfitPage.jsx      # Complete Your Look, pools & curated looks
│       │   └── AboutPage.jsx       # CV math formulas, architecture diagram & health
│       └── services/
│           └── api.js              # Axios service endpoints
│
└── README.md
```

---

## 7. Installation Instructions

### Prerequisites
- **Python 3.10+** (Python 3.13 tested)
- **Node.js v18+** & **npm**

### Backend Setup
1. Open a terminal in the project root:
   ```bash
   cd /path/to/voguevision
   ```
2. Activate or create the Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. (Optional) Run dataset setup if you wish to re-extract histograms:
   ```bash
   python backend/setup_catalog.py
   ```

### Frontend Setup
1. In a separate terminal or subfolder:
   ```bash
   cd frontend
   npm install
   ```

---

## 8. Running the Application

### 1. Start the Flask Backend (Port 5001)
From the project root with the virtual environment activated:
```bash
./venv/bin/python backend/app.py
```
*The server will start at `http://127.0.0.1:5001`.*

### 2. Start the Vite Frontend (Port 5173 / 5176)
In another terminal:
```bash
cd frontend
npm run dev
```
Open your browser at the displayed local URL (e.g., `http://localhost:5176`).

---

## 9. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend status, catalog size, and OpenCV version. |
| `GET` | `/api/products` | Returns all catalog products (optional `?category=` filter). |
| `POST` | `/api/analyze` | Accepts multipart image file, base64 data URL, or sample name. Returns dominant colors, top 5 similar items with correlation scores, and recommended outfits. |
| `POST` | `/api/recommend-outfit` | Accepts `item_id`, `category`, and `primary_color`. Returns complementary pieces and 3 styled ensembles. |

---

## 10. Sample Workflow (Demonstration Guide for Viva)

1. **Home Page (`/`)**:
   - Introduce the project scope and review the 4 pipeline cards (*Upload*, *Analyze*, *Discover*, *Style*).
2. **Instant 1-Click Demo Sandbox**:
   - Click on the *"Pink Floral Puff Top"* query card.
3. **OpenCV Processing Feedback**:
   - Observe the step-by-step progress indicator (*Preprocessing*, *Extracting dominant colors*, *Finding similar items*, *Generating outfit matches*).
4. **Analysis Dashboard**:
   - Review **Column 1**: Uploaded item preview and detected category badge (*Women's Top*).
   - Review **Dominant Colors**: 4 K-Means cluster swatches with hex codes and surface coverage percentages.
   - Review **Column 2**: Top 5 similar clothing items ranked by Pearson correlation.
   - Click any product to open the **Product Detail Modal** and demonstrate the exact `cv2.compareHist` mathematical score ($r = 1.0$ for exact matches).
5. **Outfit Match Page (`/outfits`)**:
   - Click *"Coordinate Complete Outfit"* to navigate to the fashion styling studio.
   - Review complementary pools grouped by **Bottoms**, **Footwear**, and **Handbags**.
   - Review the 3 Curated Outfit Combinations (*Casual Chic Denim*, *Tailored Elegance*, *Modern Parisian*).
6. **About Page (`/about`)**:
   - Review the architecture diagram and live backend health check confirming OpenCV active status.

---

## 11. Limitations & Future Scope
- **Color Distribution vs. Semantic Semantics:** HSV histogram correlation evaluates chromatic distribution and texture density rather than deep semantic clothing cuts or silhouette boundaries.
- **Background Interference:** In complex wild images, background colors can influence histogram bins unless masked by foreground segmentation (e.g., OpenCV GrabCut or thresholding).
- **Future Enhancements:** Integrating edge-based feature descriptors (SIFT/ORB) or lightweight convolutional embeddings for structural pattern matching.
