using QRCoder;

namespace ERPPlugandPlay.Helpers
{
    public static class QRCodeHelper
    {
        public static string GenerateQRCodeBase64(string content)
        {
            using var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);
            var qrCodeBytes = qrCode.GetGraphic(20);
            return Convert.ToBase64String(qrCodeBytes);
        }

        public static string GenerateUniqueCode() =>
            $"GP-{Guid.NewGuid():N}".ToUpper()[..20];
    }
}
