using ClosedXML.Excel;

namespace ERPPlugandPlay.Helpers
{
    public static class ExportHelper
    {
        public static byte[] ExportToExcel<T>(IEnumerable<T> data, string sheetName = "Report")
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add(sheetName);

            var properties = typeof(T).GetProperties();

            // Header row
            for (int i = 0; i < properties.Length; i++)
                worksheet.Cell(1, i + 1).Value = properties[i].Name;

            // Data rows
            int row = 2;
            foreach (var item in data)
            {
                for (int col = 0; col < properties.Length; col++)
                {
                    var value = properties[col].GetValue(item);
                    worksheet.Cell(row, col + 1).Value = value?.ToString() ?? "";
                }
                row++;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
