FROM mcr.microsoft.com/dotnet/sdk:8.0 AS development

# Thiết lập thư mục làm việc trỏ thẳng vào thư mục chứa .csproj của API
WORKDIR /app/UrlShortener

# Lệnh này tùy chọn nhưng cần thiết cho dotnet watch (chỉ định polling)
ENV DOTNET_USE_POLLING_FILE_WATCHER=1

# 🔥 Đảm bảo ứng dụng chạy ở chế độ Development
ENV ASPNETCORE_ENVIRONMENT=Development

# 🔥 Cho phép app lắng nghe trên tất cả interfaces (không chỉ localhost)
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "watch", "run", "--non-interactive", "--no-launch-profile"]