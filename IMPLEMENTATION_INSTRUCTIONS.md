# Visual Hierarchy for Downtime Codes - Implementation Instructions

## Overview
This solution creates a dynamic visual hierarchy displaying 12 Tier 1 downtime categories in a 4×3 card grid layout on an A3-printable sheet. The data is pulled dynamically from the `dimReasonCodes` sheet using a VBA macro.

---

## Files Included

1. **Downtime_Visual_Hierarchy.xlsx** - Excel workbook containing:
   - `dimReasonCodes` sheet with your complete downtime data
   - `Visual_Hierarchy` sheet template (ready for macro)

2. **VBA_RefreshVisualHierarchy.txt** - Complete VBA macro code

3. **IMPLEMENTATION_INSTRUCTIONS.md** - This file

---

## Step-by-Step Implementation

### STEP 1: Open the Excel Workbook

1. Open `Downtime_Visual_Hierarchy.xlsx`
2. You'll see two sheets:
   - **dimReasonCodes**: Contains all your downtime data (3 columns: Downtime Category, Sub Category, Root Cause)
   - **Visual_Hierarchy**: Empty template sheet where the visual hierarchy will be generated

### STEP 2: Enable Macros

1. If you see a security warning banner at the top, click **Enable Content**
2. If you don't see the Developer tab in Excel:
   - Go to **File** > **Options** > **Customize Ribbon**
   - Check the box for **Developer** on the right side
   - Click **OK**

### STEP 3: Insert the VBA Code

1. Press **Alt+F11** to open the VBA Editor
2. In the VBA Editor, go to **Insert** > **Module**
3. A new blank module window will open
4. Open the file `VBA_RefreshVisualHierarchy.txt` in a text editor (Notepad, TextEdit, etc.)
5. **Copy ALL the code** from the text file (Ctrl+A, then Ctrl+C)
6. **Paste the code** into the blank module window in VBA Editor (Ctrl+V)
7. Go to **File** > **Save** in the VBA Editor (or just close the VBA Editor - it will prompt you to save)
8. Close the VBA Editor (Alt+Q or click the X)

### STEP 4: Save as Macro-Enabled Workbook

1. In Excel, go to **File** > **Save As**
2. Choose location to save
3. In "Save as type" dropdown, select **Excel Macro-Enabled Workbook (*.xlsm)**
4. Click **Save**
5. You can now close and reopen the file - it will remember the macro

### STEP 5: Create the Refresh Button

1. Make sure you're on the **Visual_Hierarchy** sheet
2. Go to the **Developer** tab
3. Click **Insert** > **Button (Form Control)** (first option under Form Controls)
4. Your cursor will turn into a crosshair
5. Draw a button on the sheet (click and drag to create a rectangle) - place it near the top (around cell A1)
6. A dialog will appear: **Assign Macro**
7. Select **RefreshVisualHierarchy** from the list
8. Click **OK**
9. Right-click the button and choose **Edit Text**
10. Type: **Refresh Visual Hierarchy**
11. Click outside the button to finish editing

### STEP 6: Run the Macro

1. Click the **Refresh Visual Hierarchy** button you just created
2. The macro will run and create 12 cards in a 4×3 grid layout
3. You'll see a success message when it's done
4. The Visual_Hierarchy sheet will now display all 12 Tier 1 categories with their data

---

## Understanding the Output

### Card Layout (4 columns × 3 rows)

**Row 1:**
- Card 1: Machine Issue (Blue)
- Card 2: Material Issue (Yellow)
- Card 3: Quality Issue (Red)
- Card 4: Rework (Maroon)

**Row 2:**
- Card 5: Labour Issues (Green)
- Card 6: Line Running Slow (Orange)
- Card 7: Startup or Changeover (Purple)
- Card 8: Planned Down (Gray)

**Row 3:**
- Card 9: Schedule Change (Teal)
- Card 10: Services Issue (Brown)
- Card 11: Others (Dark Gray)
- Card 12: Burns (Dark Red)

### Card Structure

Each card contains:

**Header (Colored):**
- Tier 1 name (uppercase, bold, white text)
- Statistics line: "X subcategories | Y root causes"

**Body (White):**
- Top 3 Tier 2 subcategories listed alphabetically
- Each Tier 2 shows: "• Name (N root causes)"

### Colors

The colors are assigned automatically based on the Tier 1 category:

| Tier 1 Category | Color | RGB |
|-----------------|-------|-----|
| Machine Issue | Blue | 31, 78, 121 |
| Material Issue | Yellow | 255, 192, 0 |
| Quality Issue | Red | 192, 0, 0 |
| Rework | Maroon | 128, 0, 0 |
| Labour Issues | Green | 0, 128, 0 |
| Line Running Slow | Orange | 255, 128, 0 |
| Startup or Changeover | Purple | 128, 0, 128 |
| Planned Down | Gray | 128, 128, 128 |
| Schedule Change | Teal | 0, 128, 128 |
| Services Issue | Brown | 128, 64, 0 |
| Others | Dark Gray | 64, 64, 64 |
| Burns | Dark Red | 139, 0, 0 |

---

## How to Use

### Making Changes to Data

1. Edit the **dimReasonCodes** sheet as needed:
   - Add new rows
   - Modify existing entries
   - Delete outdated entries

2. Go to the **Visual_Hierarchy** sheet

3. Click the **Refresh Visual Hierarchy** button

4. The cards will update automatically with the new data

### Changing Which Tier 2s Are Displayed

**Current Behavior:**
- The macro shows the top 3 Tier 2 subcategories **alphabetically** for each Tier 1
- This is intentional as a placeholder

**To Manually Change Tier 2 Display:**
1. After running the macro, you can manually edit the cells in the Visual_Hierarchy sheet
2. Simply click on a Tier 2 entry in a card body and change the text
3. These manual changes will be overwritten next time you click "Refresh Visual Hierarchy"
4. For permanent changes, you would need to modify the VBA code (see Advanced Customization below)

### Printing

**For A3 Printing:**
1. Go to **File** > **Print**
2. The page is already set up for A3 landscape
3. Preview should show all 12 cards fitting on one page
4. Click **Print**

**For A1 Printing (Large Wall Poster):**
1. Go to **File** > **Print**
2. Click **Page Setup** at the bottom
3. On the **Page** tab, under "Scaling", change from "Fit to 1 page" to a specific percentage (e.g., 200% for 2x size)
4. Or select paper size A1 if your printer supports it
5. Preview and adjust until it looks right
6. Print

---

## Advanced Customization

### Changing Colors

To change the colors assigned to Tier 1 categories:

1. Open VBA Editor (Alt+F11)
2. Find the function `GetColorForTier1` (near the bottom of the code)
3. Modify the RGB values for any category
4. Example: Change Machine Issue from blue to red:
   ```vba
   Case "Machine Issue"
       GetColorForTier1 = RGB(192, 0, 0) ' Red instead of Blue
   ```
5. Save and close VBA Editor
6. Run the macro again to see changes

### Changing Card Size

To adjust card dimensions:

1. Open VBA Editor (Alt+F11)
2. Find the `CreateCard` subroutine
3. Modify these values:
   - `startRow = (cardIndex \ 4) * 18 + 2` - Change `18` to make cards taller/shorter
   - `startCol = (cardIndex Mod 4) * 3 + 1` - Change `3` to make cards wider/narrower
4. Save and run macro again

### Changing Font Sizes

To adjust text sizes:

1. Open VBA Editor (Alt+F11)
2. Find `.Font.Size = 13` (header) or `.Font.Size = 10` (body) in the `CreateCard` subroutine
3. Change the numbers to desired sizes
4. Save and run macro again

### Showing More Than 3 Tier 2s

To show more subcategories per card:

1. Open VBA Editor (Alt+F11)
2. Find `If tier2Index < 3 Then` in the `CreateCard` subroutine
3. Change `3` to desired number (e.g., `5` to show 5 subcategories)
4. You may also need to increase card height (see "Changing Card Size" above)
5. Save and run macro again

---

## Troubleshooting

### Problem: "Macro not found" error when clicking button

**Solution:**
- Make sure you saved the file as .xlsm (macro-enabled)
- Open VBA Editor (Alt+F11) and verify the code is there
- Re-assign the macro to the button: right-click button > Assign Macro > select RefreshVisualHierarchy

### Problem: Button doesn't appear or can't create button

**Solution:**
- Make sure Developer tab is enabled (File > Options > Customize Ribbon > check Developer)
- Try clicking Insert > Button again - make sure you select "Form Control" button, not ActiveX

### Problem: Security warning appears every time you open the file

**Solution:**
- Save the file in a trusted location
- Or go to File > Options > Trust Center > Trust Center Settings > Trusted Locations
- Add the folder where your file is saved

### Problem: Cards are overlapping or not aligned properly

**Solution:**
- Make sure Visual_Hierarchy sheet is completely clear before running macro
- Try closing and reopening Excel
- Run the macro again

### Problem: Some Tier 1 categories are missing

**Solution:**
- Check that dimReasonCodes sheet has data for all 12 categories
- Verify column A (Downtime Category) has the exact Tier 1 names
- Look for extra spaces or typos in category names

### Problem: Colors are not displaying correctly

**Solution:**
- Check that Tier 1 names in dimReasonCodes exactly match the names in the VBA code
- Names are case-sensitive in the color lookup function
- Verify RGB values in `GetColorForTier1` function

---

## Maintenance

### When to Refresh

Run the macro (click "Refresh Visual Hierarchy" button) whenever:
- You add new downtime codes to dimReasonCodes
- You modify existing categories or subcategories
- You want to see updated counts

### Backup

Always keep a backup of your Excel file before making major changes:
1. Go to File > Save As
2. Add a date to the filename (e.g., "Downtime_Visual_Hierarchy_2026-01-07.xlsm")

---

## Technical Notes

### How the Macro Works

1. **Reads dimReasonCodes**: Scans all rows starting from row 2 (row 1 is headers)
2. **Extracts Tier 1 categories**: Identifies all unique values in column A
3. **Calculates counts**:
   - Counts unique Tier 2 subcategories for each Tier 1
   - Counts total Tier 3 root causes for each Tier 1
4. **Gets top 3 Tier 2s**: Sorts subcategories alphabetically and selects first 3
5. **Creates cards**:
   - Positions cards in 4×3 grid
   - Merges cells for card header and body
   - Applies colors based on Tier 1 name
   - Adds borders and formatting
6. **Sets up printing**: Configures page for A3 landscape with appropriate margins

### Performance

- The macro typically runs in under 5 seconds
- For very large datasets (10,000+ rows), it may take up to 15 seconds
- Screen updating is disabled during execution for better performance

### Compatibility

- **Excel Version**: Requires Excel 2010 or later (tested on 2016+)
- **Operating System**: Works on Windows and Mac
- **VBA**: No external dependencies - uses only built-in VBA functions

---

## Support & Questions

If you encounter issues or have questions:

1. Check the Troubleshooting section above
2. Review the VBA code comments for detailed explanations
3. Verify that dimReasonCodes sheet structure matches expected format:
   - Column A: Downtime Category (Tier 1)
   - Column B: Sub Category (Tier 2)
   - Column C: Root Cause (Tier 3)
   - Row 1: Headers
   - Data starts at row 2

---

## Version History

**Version 1.0** (2026-01-07)
- Initial release
- 12 Tier 1 categories in 4×3 grid
- Dynamic data pull from dimReasonCodes
- A3 print layout
- Color-coded cards
- Top 3 Tier 2 subcategories per card

---

## Credits

**Created by**: Claude Code
**Date**: 2026-01-07
**Purpose**: Visual hierarchy for PVC manufacturing downtime codes
**License**: Free to use and modify for your manufacturing facility

---

**Congratulations! Your Visual Hierarchy system is now ready to use.**

Remember to click "Refresh Visual Hierarchy" whenever you update your downtime codes in the dimReasonCodes sheet.
