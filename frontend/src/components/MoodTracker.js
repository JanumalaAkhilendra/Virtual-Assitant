// frontend/src/components/MoodTracker.js
import './ChatWindow.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,  // Import CategoryScale for 'category'
  LinearScale,    // Import LinearScale for numerical values
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,  // Register 'category' scale
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodTracker = ({ userId }) => {
  const [mood, setMood] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mood/${userId}`);
        setMoodHistory(response.data.moods);
      } catch (error) {
        console.error('Error fetching mood history:', error);
      }
    };
    fetchMoodHistory();
  }, [userId]);

  const handleMoodSubmit = async () => {
    if (mood.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/api/mood', {
          userId,
          mood,
        });
        setMoodHistory([...moodHistory, response.data.mood]);
        setMood('');
      } catch (error) {
        console.error('Error submitting mood:', error);
      }
    }
  };

  // Prepare data for the chart visualization
  const moodChartData = {
    labels: moodHistory.map(m => new Date(m.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood Over Time',
        data: moodHistory.map(m => {
          switch (m.mood.toLowerCase()) {
            case 'happy':
              return 5;
            case 'neutral':
              return 3;
            case 'sad':
              return 1;
            default:
              return 2;  // Default score for undefined moods
          }
        }),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div className='secondsection' >
      <h2>Mood Tracker</h2>
      <input
        type="text"
        className="input"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Enter your current mood (e.g., happy, sad, neutral)"
      />
      <button onClick={handleMoodSubmit} >
        <span className="button_top"> Track Mood </span>
      </button>
      <div className='chart'>
        <Line data={moodChartData} />
      </div>
    </div>
  );
};

export default MoodTracker;
