import React, { useEffect, useState} from 'react'
import axios from 'axios';
import './css/Quotes.scss';

function Quotes() {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const interval = setInterval(function fetchQuote() {
            axios.get('https://api.adviceslip.com/advice')
                .then((response) => {
                    if (!response.data || !response.data.slip.advice) throw "";
                    setQuote(response.data.slip);
                })
                .catch((_) => {
                    if (!quote) {
                        setQuote({
                            advice: "It is better to fail in originality than to succeed in imitation",
                            id: 100
                        });
                    }
                })

            return fetchQuote;
        }(), 59999);

        return () => {
            clearInterval(interval);
        }
    }, [])

  return (
      <div>
          {quote && <div className='quote-box'>
              <h3>Quote #{quote.id}</h3>
              <p>{`“${quote.advice}”`}</p>
              <div className='aqua-circle'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect width="6" height="6" fill="#192A32" />
                      <rect x="6" y="6" width="6" height="6" fill="#192A32" />
                  </svg>
              </div>
          </div>
          }
      </div>
  )
}

export default Quotes