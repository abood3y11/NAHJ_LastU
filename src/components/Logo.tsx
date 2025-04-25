import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8" }) => {
  return (
    <img 
      src="https://private-user-images.githubusercontent.com/69038940/437102883-ebaed89c-be7d-4347-9ec8-106a56a8688e.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDU1MTAwMTYsIm5iZiI6MTc0NTUwOTcxNiwicGF0aCI6Ii82OTAzODk0MC80MzcxMDI4ODMtZWJhZWQ4OWMtYmU3ZC00MzQ3LTllYzgtMTA2YTU2YTg2ODhlLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA0MjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNDI0VDE1NDgzNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWFmZDkwNTMyMWFjOWM5ZmYyMDkxNGUxNmQyNjQ1NzY2NjA0MmJmNzY3OTRlYTM4ZThkYzVjNzM3ZTcyNGZhZGUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.QbWyEkwNQJSi7Q11Ror-dvseHiY0ql_PjDsY-yiiPag" 
      alt="SmartMentor نهج" 
      className={className}
    />
  );
};

export default Logo;