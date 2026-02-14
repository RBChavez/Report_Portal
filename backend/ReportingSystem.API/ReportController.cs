using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReportingSystem.Models;
using ReportingSystem.Business;

namespace ReportingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesReport>>> GetReports()
        {
            var reports = await _reportService.GetFullReportAsync();
            return Ok(reports);
        }
    }
}
