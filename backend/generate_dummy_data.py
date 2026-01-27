from fpdf import FPDF
import os

def create_isro_pdf(filename, title, content, target_size_mb=0, pages=20):
    pdf = FPDF()
    
    for p in range(1, pages + 1):
        pdf.add_page()
        # Header
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, f"{title} - Page {p}", ln=True, align='C')
        pdf.ln(5)
        
        # Section Header
        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 10, f"Section {p}: Technical Details & Analysis", ln=True)
        pdf.ln(2)
        
        # Content (Repeat major content to ensure density, then add page-specific filler)
        pdf.set_font("Helvetica", size=10)
        pdf.multi_cell(0, 8, content)
        pdf.ln(5)
        
        # Filler text to make it look like a real document
        filler = "This section contains detailed telemetry data, structural analysis, and mission parameters. " * 30
        pdf.multi_cell(0, 8, filler)
        
    output_path = os.path.join("uploads", filename)
    pdf.output(output_path)
    
    # Inflate file to target size exactly
    if target_size_mb > 0:
        current_size = os.path.getsize(output_path)
        target_size_bytes = int(target_size_mb * 1024 * 1024)
        if target_size_bytes > current_size:
            with open(output_path, "ab") as f:
                f.write(b'0' * (target_size_bytes - current_size))
                
    print(f"Created {output_path} (Size: {os.path.getsize(output_path) / (1024*1024):.2f} MB, Pages: {pages})")

# Data definitions
ch3_content = """Mission Overview: Chandrayaan-3 is a follow-on mission to Chandrayaan-2, designed to demonstrate end-to-end capabilities in safe lunar landing and roving on the lunar surface.
Launch Date: July 14, 2023
Landing Date: August 23, 2023
Landing Site: Near the lunar South Pole
Objectives: Safe and soft landing, Rover roving, and in-situ scientific experiments.
Lander Payloads: ChaSTE, ILSA, LP, LRA.
Rover Payloads: LIBS, APXS."""

pslv_content = """Mission: PSLV-C57 / Aditya-L1
Launch Date: September 2, 2023
Objectives: Studying solar activities and space weather.
Orbit: Lagrange point L1 (1.5 million km).
Scientific Payloads: VELC, SUIT, SoLEXS, HEL1OS, ASPEX, PAPA, Magnetometers."""

gaganyaan_content = """Mission: Gaganyaan Human Spaceflight Program v2.0
Key Safety Systems: Crew Escape System (CES), Pad Abort System, Human-Rated LVM3.
Thermal Protection: Outer heat shield for re-entry.
Parachute System: 10-parachute multi-stage system.
Crew Training: Simulators, survival, and aero-medical training."""

if __name__ == "__main__":
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
        
    # Clear old dummy files to be clean
    for f in ["Chandrayaan-3_Mission_Profile.pdf", "PSLV-C57_Brochure.pdf", "Gaganyaan_Safety_Protocols_v2.pdf"]:
        p = os.path.join("uploads", f)
        if os.path.exists(p):
            os.remove(p)

    create_isro_pdf("Chandrayaan-3_Mission_Profile.pdf", "Chandrayaan-3 Mission Profile", ch3_content, 2.4, 20)
    create_isro_pdf("PSLV-C57_Brochure.pdf", "PSLV-C57 Brochure (Aditya-L1)", pslv_content, 1.1, 20)
    create_isro_pdf("Gaganyaan_Safety_Protocols_v2.pdf", "Gaganyaan Safety Protocols v2", gaganyaan_content, 5.8, 20)
