import React, { useState, useEffect } from "react";

interface Article {
  title: string;
  url: string;
}

interface NewsCardProps {
  city: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ city }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    const fetchNews = async () => {
      setLoading(true);
      try {
        const apiKey = "10c488335d294a2580e5be93f9af4537"; // 🔑 NewsAPI key
        const url = `https://newsapi.org/v2/everything?q=${city}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      }
      setLoading(false);
    };

    fetchNews();
  }, [city]);

  return (
    <div className="bg-gradient-to-r from-green-300 to-blue-500 text-white p-5 rounded-2xl shadow-lg w-full max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-3">📰 Latest News</h2>

      {loading ? (
        <p>Loading news...</p>
      ) : articles.length > 0 ? (
        <ul className="space-y-2">
          {articles.map((article, index) => (
            <li key={index}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
};

export default NewsCard;
