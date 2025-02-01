using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Text.Json;

namespace KudosCraft.services
{
    public class SecureStorage
    {
        private readonly string _filePath;

        public SecureStorage()
        {
            _filePath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "KudosCraft",
                "auth.dat"
            );

            Directory.CreateDirectory(Path.GetDirectoryName(_filePath));
        }

        public void SaveData<T>(T data)
        {
            var json = JsonSerializer.Serialize(data);
            var encodedData = Encoding.UTF8.GetBytes(json);
            var encryptedData = ProtectedData.Protect(
                encodedData,
                null,
                DataProtectionScope.CurrentUser
            );

            File.WriteAllBytes(_filePath, encryptedData);
        }

        public T LoadData<T>() where T : class
        {
            if (!File.Exists(_filePath))
                return null;

            var encryptedData = File.ReadAllBytes(_filePath);
            var decryptedData = ProtectedData.Unprotect(
                encryptedData,
                null,
                DataProtectionScope.CurrentUser
            );
            var json = Encoding.UTF8.GetString(decryptedData);

            return JsonSerializer.Deserialize<T>(json);
        }

        public void ClearData()
        {
            if (File.Exists(_filePath))
                File.Delete(_filePath);
        }
    }
}