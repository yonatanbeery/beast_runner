import {useContext, useEffect, useState} from 'react';
import '../styles/postsPage.css';
import {AuthContext} from "../../App";
import Login from "../Login";
import axios from 'axios';
import { connectToAi } from '../../services/connectToAi';

enum Gender {
    female,
    male
}

export interface UserFitnessData {
    weight: number;
    height: number;
    gender: Gender;
    moveMinuets: number;
    heartPoints: number;
    age: number;
}

interface SessionsResponse {
    deletedSession: Session[];
    nextPageToken: string;
    session: Session[];
}

interface Session {
    activityType: number;
    application: { packageName: string, version: string, detailsUrl: string }
    description: string
    endTimeMillis: string
    id: string
    modifiedTimeMillis: string
    name: string
    startTimeMillis: string
}

const ActivitiesPage = () => {
    const {authToken} = useContext(AuthContext);
    const [runningSessions, setRunningSessions] = useState<SessionsResponse>();
    const [userFitnessData, setUserFitnessData] = useState<UserFitnessData>({
        weight: 0,
        height: 0,
        gender: Gender.male,
        moveMinuets: 0,
        heartPoints: 0,
        age: 0,
    });
    const [birthYear, setBirthYear] = useState<number>(new Date().getFullYear());
    const [plan, setPlan] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);

    const fetchSessions = async () => {
        console.log("fetching sessions");
        axios.get(`https://www.googleapis.com/fitness/v1/users/me/sessions?pageToken=`, {
            headers: {
                authorization: `Bearer ${authToken.refreshToken}`
            }
        }).then((res) => {
            console.log(res.data);
            setRunningSessions(res.data);
        })
    }

    const fetchWeightData = async () => {
        const startTimeNs = new Date('2024-01-01').getTime() * 1e6; // Example start time
        const endTimeNs = Date.now() * 1e6; // Current time
        const datasetId = `${startTimeNs}-${endTimeNs}`;
        console.log("fetching weight");
        axios.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.weight:com.google.android.gms:merge_weight/datasets/${datasetId}`, {
            headers: {
                authorization: `Bearer ${authToken.refreshToken}`
            }
        }).then((res) => {
            console.log(res.data);
            if (res.data.point && res.data.point.length > 0) {
                const latestDataPoint = res.data.point[res.data.point.length - 1];
                const latestWeightValue = latestDataPoint.value[0].fpVal;
                setUserFitnessData(prevData => ({...prevData, weight: latestWeightValue}));
            }
        }).catch((error) => {
            console.error('Error fetching weight data:', error);
        })
    };

    const fetchHeightData = async () => {
        const startTimeNs = new Date('2024-01-01').getTime() * 1e6; // Example start time
        const endTimeNs = Date.now() * 1e6; // Current time
        const datasetId = `${startTimeNs}-${endTimeNs}`;
        console.log("fetching height");
        axios.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.height:com.google.android.gms:merge_height/datasets/${datasetId}`, {
            headers: {
                authorization: `Bearer ${authToken.refreshToken}`
            }
        }).then((res) => {
            console.log(res.data);
            if (res.data.point && res.data.point.length > 0) {
                const latestDataPoint = res.data.point[res.data.point.length - 1];
                const latestHeightValue = latestDataPoint.value[0].fpVal * 100; // Convert to cm
                setUserFitnessData(prevData => ({...prevData, height: latestHeightValue}));
            }
        }).catch((error) => {
            console.error('Error fetching height data:', error);
        })
    };


    // const fetchMoveMinutes = async () => {
    //     const startTimeNs = new Date('2024-01-01').getTime() * 1e6; // Example start time
    //     const endTimeNs = Date.now() * 1e6; // Current time
    //     const datasetId = `${startTimeNs}-${endTimeNs}`;
    //     console.log("fetching move minutes");
    //     axios.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes/datasets/${datasetId}`, {
    //         headers: {
    //             authorization: `Bearer ${authToken.refreshToken}`
    //         }
    //     }).then((res) => {
    //         console.log(res.data);
    //         if (res.data.point && res.data.point.length > 0) {
    //             const totalMoveMinutes = res.data.point.reduce((sum: number, point: DataPoint) => sum + point.value[0].intVal, 0);
    //             setUserFitnessData(prevData => ({ ...prevData, moveMinuets: totalMoveMinutes }));
    //         }
    //     }).catch((error)=> {
    //         console.error('Error fetching move minutes:', error);
    //     })
    // };
    //
    // const fetchHeartPoints = async () => {
    //     const startTimeNs = new Date('2024-01-01').getTime() * 1e6; // Example start time
    //     const endTimeNs = Date.now() * 1e6; // Current time
    //     const datasetId = `${startTimeNs}-${endTimeNs}`;
    //     console.log("fetching heart points");
    //     axios.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes/datasets/${datasetId}`, {
    //         headers: {
    //             authorization: `Bearer ${authToken.refreshToken}`
    //         }
    //     }).then((res) => {
    //         console.log(res.data);
    //         if (res.data.point && res.data.point.length > 0) {
    //             const totalHeartPoints = res.data.point.reduce((sum: number, point: DataPoint) => sum + point.value[0].fpVal, 0);
    //             setUserFitnessData(prevData => ({ ...prevData, heartPoints: totalHeartPoints }));
    //         }
    //     }).catch((error)=> {
    //         console.error('Error fetching heart points:', error);
    //     })
    // };

    const fetchMoveMinutesDataFromLastMonth = async () => {
        const endTimeMillis = Date.now();
        const startTimeMillis = endTimeMillis - (30 * 24 * 60 * 60 * 1000); // Last 30 days

        const requestPayload = {
            aggregateBy: [{
                dataTypeName: "com.google.active_minutes",
            }],
            bucketByTime: {durationMillis: 86400000},
            startTimeMillis: startTimeMillis,
            endTimeMillis: endTimeMillis,
        };

        try {
            const res = await axios.post(
                'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                requestPayload,
                {
                    headers: {
                        authorization: `Bearer ${authToken.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("MOVE-MINUTES:")
            console.log(res.data)

            let totalMinutes = 0;
            let bucketCount = 0;

            res.data.bucket.forEach((bucket: any) => {
                if (bucket.dataset[0].point.length > 0) {
                    totalMinutes += bucket.dataset[0].point[0].value[0].intVal;
                    bucketCount++;
                }
            });
            setUserFitnessData(prevData => ({ ...prevData, moveMinuets: (totalMinutes / bucketCount)}));
        } catch (error) {
            console.error('Error fetching Move Minutes data:', error);
        }
    };

    const fetchHeartPointsDataFromLastMonth = async () => {
        const endTimeMillis = Date.now();
        const startTimeMillis = endTimeMillis - (30 * 24 * 60 * 60 * 1000); // Last 30 days

        const requestPayload = {
            aggregateBy: [{
                dataTypeName: "com.google.heart_minutes",
            }],
            bucketByTime: {durationMillis: 86400000},
            startTimeMillis: startTimeMillis,
            endTimeMillis: endTimeMillis,
        };

        try {
            const res = await axios.post(
                'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                requestPayload,
                {
                    headers: {
                        authorization: `Bearer ${authToken.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("HEART-POINTS:")
            console.log(res.data)

            let totalPoints = 0;
            let bucketCount = 0;

            res.data.bucket.forEach((bucket: any) => {
                if (bucket.dataset[0].point.length > 0) {
                    totalPoints += bucket.dataset[0].point[0].value[0].fpVal;
                    bucketCount++;
                }
            });

            setUserFitnessData(prevData => ({ ...prevData, heartPoints: (totalPoints / bucketCount) }));
        } catch (error) {
            console.error('Error fetching Heart Points data:', error);
        }
    };


    const fetchPlan = async () => {
        setIsLoading(true);
        const aiPlan = await connectToAi(userFitnessData);
        setIsLoading(false);
        setPlan(aiPlan);
    }

    useEffect(() => {
        if (authToken.accessToken) {
            fetchSessions();
            fetchWeightData();
            fetchHeightData();
            fetchMoveMinutesDataFromLastMonth();
            fetchHeartPointsDataFromLastMonth();
        }
    }, [authToken]);

    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGender = event.target.value as Gender;
        setUserFitnessData(prevData => ({...prevData, gender: selectedGender}));
    };

    const handleBirthYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedYear = parseInt(event.target.value);
        const currentYear = new Date().getFullYear();
        const calculatedAge = currentYear - selectedYear;
        setBirthYear(selectedYear);
        setUserFitnessData(prevData => ({...prevData, age: calculatedAge}));
    };

    return (
        authToken.accessToken ?
            <>
                <h3>
                    You are logged in, your access token is: {authToken.accessToken}.
                </h3>
                <h4>
                    Latest running sessions are: {runningSessions?.session.map((session) => <div
                    key={session.id}>name: {session.name}, startTimeMillis: {session.startTimeMillis},
                    endTimeMillis: {session.endTimeMillis}</div>)}
                </h4>
                <h4>
                    Weight: {userFitnessData.weight ? `${userFitnessData.weight} kg` : "undefined"}
                </h4>
                <h4>
                    Height: {userFitnessData.height ? `${userFitnessData.height} cm` : "undefined"}
                </h4>
                <h4>
                    Gender:
                    <select value={userFitnessData.gender} onChange={handleGenderChange}>
                        <option value={Gender.male}>Male</option>
                        <option value={Gender.female}>Female</option>
                    </select>
                </h4>
                <h4>
                    Age: {userFitnessData.age ? `${userFitnessData.age} years` : "undefined"}
                </h4>
                <h4>
                    Move Minutes: {userFitnessData.moveMinuets ? `${userFitnessData.moveMinuets} minutes` : "undefined"}
                </h4>
                <h4>
                    Heart Points: {userFitnessData.heartPoints ? `${userFitnessData.heartPoints} points` : "undefined"}
                </h4>
                <h4>
                    Birth Year:
                    <input type="number" value={birthYear} onChange={handleBirthYearChange}/>
                </h4>
                <button onClick={fetchPlan}>generate plan</button>
                <h4>
                    Training plan:
                    {isLoading ? 'loading...' : plan}
                </h4>
            </>
            : <Login/>
    );
};

export default ActivitiesPage;
