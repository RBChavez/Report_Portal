using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using ReportingSystem.Models;

namespace ReportingSystem.DataAccess
{
    public interface IReportRepository
    {
        Task<IEnumerable<SalesReport>> GetAllReportsAsync();
    }

    public class ReportRepository : IReportRepository
    {
        private readonly string _connectionString;

        public ReportRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<SalesReport>> GetAllReportsAsync()
        {
            var reports = new List<SalesReport>();

            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "SELECT Id, ProductName, Category, Amount, SaleDate, Region FROM SalesReports";
                using (var command = new SqlCommand(query, connection))
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            reports.Add(new SalesReport
                            {
                                Id = reader.GetInt32(0),
                                ProductName = reader.GetString(1),
                                Category = reader.GetString(2),
                                Amount = reader.GetDecimal(3),
                                SaleDate = reader.GetDateTime(4),
                                Region = reader.GetString(5)
                            });
                        }
                    }
                }
            }

            return reports;
        }
    }
}
