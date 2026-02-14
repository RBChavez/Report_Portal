using System.Collections.Generic;
using System.Threading.Tasks;
using ReportingSystem.Models;
using ReportingSystem.DataAccess;

namespace ReportingSystem.Business
{
    public interface IReportService
    {
        Task<IEnumerable<SalesReport>> GetFullReportAsync();
    }

    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;

        public ReportService(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SalesReport>> GetFullReportAsync()
        {
            // Business logic can be added here (e.g., filtering, calculations)
            return await _repository.GetAllReportsAsync();
        }
    }
}
