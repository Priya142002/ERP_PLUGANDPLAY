namespace ERPPlugandPlay.Helpers
{
    /// <summary>
    /// Generates a unique, human-readable Financial Year code.
    ///
    /// Format:  FY{StartYear}-{EndYear2Digit}-C{CompanyId:D4}
    /// Example: FY2025-26-C0001  (Company 1, April 2025 – March 2026)
    ///          FY2026-27-C0012  (Company 12, April 2026 – March 2027)
    ///
    /// Rules:
    ///   - Always unique per company per year (CompanyId + StartYear combination)
    ///   - Never changes after creation
    ///   - Used as a reference key on JournalVouchers, reports, and opening balances
    /// </summary>
    public static class FYCodeGenerator
    {
        public static string Generate(int companyId, DateTime startDate, DateTime endDate)
        {
            var startYear = startDate.Year;
            var endYear2  = endDate.Year % 100; // last 2 digits of end year
            return $"FY{startYear}-{endYear2:D2}-C{companyId:D4}";
        }

        /// <summary>
        /// Parses a FYCode back into its components for display/validation.
        /// Returns null if format is invalid.
        /// </summary>
        public static (int StartYear, int EndYear2Digit, int CompanyId)? Parse(string fyCode)
        {
            try
            {
                // FY2025-26-C0001
                var parts = fyCode.Replace("FY", "").Split('-');
                if (parts.Length < 3) return null;
                var startYear  = int.Parse(parts[0]);
                var endYear2   = int.Parse(parts[1]);
                var companyId  = int.Parse(parts[2].Replace("C", ""));
                return (startYear, endYear2, companyId);
            }
            catch { return null; }
        }
    }
}
