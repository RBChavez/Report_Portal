namespace ReportingSystem.Models
{
    public class SalesReport
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string Category { get; set; }
        public decimal Amount { get; set; }
        public DateTime SaleDate { get; set; }
        public string Region { get; set; }
    }
}
