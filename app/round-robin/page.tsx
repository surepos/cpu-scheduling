"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from 'react';
import { Table, Input, Button, Card, Typography, Space, Divider, Tag, ConfigProvider, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { darkAlgorithm } = theme;

interface Process {
  key: number;
  processId: string;
  arrivalTime: number;
  burstTime: number;
  waitingTime: number;
  turnaroundTime: number;
  originalId: number;
}

export default function RoundRobin() {
  const [arrivalTime, setArrivalTime] = useState<string>('');
  const [burstTime, setBurstTime] = useState<string>('');
  const [timeQuantum, setTimeQuantum] = useState<string>('2');
  const [processes, setProcesses] = useState<Process[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [ganttChart, setGanttChart] = useState<{process: string, start: number, end: number}[]>([]);
  const [processedResults, setProcessedResults] = useState<Process[]>([]);


  useEffect(() => {
    if (processes.length === 0 || !timeQuantum) return;
  
    const quantum = parseInt(timeQuantum);
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const newCompletedProcesses: Process[] = [];
    const newGanttChart: { process: string; start: number; end: number }[] = [];
  
    let time = 0;
    const remainingProcesses = sorted.map(p => ({ ...p, remainingTime: p.burstTime }));
    const readyQueue: typeof remainingProcesses = [];
  
    while (remainingProcesses.length > 0 || readyQueue.length > 0) {
      // Add newly arrived processes to the ready queue
      while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= time) {
        readyQueue.push(remainingProcesses.shift()!);
      }
  
      if (readyQueue.length === 0) {
        // No process ready — jump to the next arrival (idle time)
        time = remainingProcesses[0].arrivalTime;
        continue;
      }
  
      const current = readyQueue.shift()!;
      const execTime = Math.min(current.remainingTime, quantum);
  
      newGanttChart.push({
        process: current.processId,
        start: time,
        end: time + execTime
      });
  
      time += execTime;
      current.remainingTime -= execTime;
  
      // Check if any process has arrived during execution time
      while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= time) {
        readyQueue.push(remainingProcesses.shift()!);
      }
  
      if (current.remainingTime > 0) {
        readyQueue.push(current); // Re-queue unfinished process
      } else {
        newCompletedProcesses.push({
          ...current,
          turnaroundTime: time - current.arrivalTime,
          waitingTime: time - current.arrivalTime - current.burstTime
        });
      }
    }
  
    const sortedCompleted = newCompletedProcesses.sort(
      (a, b) => a.arrivalTime - b.arrivalTime || a.originalId - b.originalId
    );
  
    setProcessedResults(sortedCompleted);
    setGanttChart(newGanttChart);
  }, [processes, timeQuantum]);
  

  const addProcess = () => {
    if (!arrivalTime || !burstTime) return;

    const newProcess: Process = {
      key: nextId,
      processId: `P${nextId}`,
      arrivalTime: parseInt(arrivalTime),
      burstTime: parseInt(burstTime),
      waitingTime: 0,
      turnaroundTime: 0,
      originalId: nextId,
    };
    
    setProcesses([...processes, newProcess]);
    setNextId(nextId + 1);
    setArrivalTime('');
    setBurstTime('');

  };

  const resetProcesses = () => {
    setProcesses([]);
    setProcessedResults([]);
    setNextId(1);
    setGanttChart([]);
  };

  const columns: TableColumnsType<Process> = [
    {
      title: 'Process ID',
      dataIndex: 'processId',
      key: 'processId',
      align: 'center',
      sorter: (a, b) => a.originalId - b.originalId,
    },
    {
      title: 'Arrival Time',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
      align: 'center',
      sorter: (a, b) => a.arrivalTime - b.arrivalTime,
    },
    {
      title: 'Burst Time',
      dataIndex: 'burstTime',
      key: 'burstTime',
      align: 'center',
      sorter: (a, b) => a.burstTime - b.burstTime,
    },
    {
      title: 'Turnaround Time',
      dataIndex: 'turnaroundTime',
      key: 'turnaroundTime',
      align: 'center',
      sorter: (a, b) => a.turnaroundTime - b.turnaroundTime,
    },
    {
      title: 'Waiting Time',
      dataIndex: 'waitingTime',
      key: 'waitingTime',
      align: 'center',
      sorter: (a, b) => a.waitingTime - b.waitingTime,
    },
  ];

  const calculateAverages = () => {
    if (processedResults.length === 0) return { avgWaiting: 0, avgTurnaround: 0 };

    const totalWaiting = processedResults.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurnaround = processedResults.reduce((sum, p) => sum + p.turnaroundTime, 0);

    return {
      avgWaiting: totalWaiting / processedResults.length,
      avgTurnaround: totalTurnaround / processedResults.length,
    };
  };

  const { avgWaiting, avgTurnaround } = calculateAverages();

  const getExecutionOrder = () => {
    if (ganttChart.length === 0) return null;
  
    const remainingTimes = new Map<string, number>();
    processes.forEach(p => remainingTimes.set(p.processId, p.burstTime));
  
    return (
      <div className='flex flex-col gap-4 w-full'>
        <div className='flex flex-wrap justify-start gap-x-4 gap-y-8 w-full'>
          {ganttChart.map((item, index) => {
            const executionDuration = item.end - item.start;
            const currentRemaining = remainingTimes.get(item.process) || 0;
            const newRemaining = Math.max(0, currentRemaining - executionDuration);
            remainingTimes.set(item.process, newRemaining);
  
            return (
              <div key={index} className='flex items-center'>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <Tag 
                    color="geekblue"
                    style={{ 
                      background: '#1f1f1f',
                      borderColor: '#434343',
                      color: '#fff',
                      minWidth: '57px',
                      textAlign: 'center'
                    }}
                  >
                    {item.process}
                  </Tag>
                  <Tag>
                    Rem: {newRemaining}
                  </Tag>
                </div>
                {index < ganttChart.length - 1 && (
                  <RightOutlined 
                    style={{ color: '#fff', margin: '0 8px' }} 
                    className="hidden sm:inline-block" 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: '#722ed1',
          colorBgContainer: '#1f1f1f',
          colorBorder: '#434343',
          colorText: 'rgba(255, 255, 255, 0.85)',
        },
        components: {
          Table: {
            headerBg: '#1d1d1d',
            headerColor: '#fff',
            borderColor: '#434343',
            rowHoverBg: '#2a2a2a',
          },
          Card: {
            headerBg: '#1d1d1d',
          },
          Input: {
            colorBgContainer: '#141414',
          },
          Button: {
            defaultBg: '#141414',
            defaultBorderColor: '#434343',
          },
        },
      }}
    >
      <div className='min-h-[100vh] p-5 m-auto max-w-6xl flex items-center justify-center'>
        <Card 
          title={
            <Title level={3} style={{ color: '#fff', margin: 0 }} className='flex items-center justify-center m-0'>
              Round Robin Scheduler
            </Title>
          }
          variant='borderless'
          style={{ 
            background: '#1f1f1f',
            borderColor: 'rgba(0, 0, 0, 0)'
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              Round Robin is a CPU scheduling algorithm where each process is assigned a fixed time slot (quantum) in cyclic order.
              Processes that don't complete within their time quantum are moved to the back of the queue.
            </Text>

            <Divider orientation="left" style={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              borderColor: '#434343'
            }}>
              Configuration
            </Divider>

            <Space size="middle" wrap>
              <Input
                addonBefore={<span style={{ color: '#fff' }}>Time Quantum</span>}
                placeholder="Enter time quantum"
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(e.target.value)}
                style={{ width: '200px'}}
                className="no-spinner"
              />
            </Space>

            <Divider orientation="left" style={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              borderColor: '#434343'
            }}>
              Add Process
            </Divider>

            <Space size="middle" wrap>
              <Input
                addonBefore={<span style={{ color: '#fff' }}>Arrival Time</span>}
                placeholder="Enter arrival time"
                type="number"
                min="0"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                style={{ width: '200px'}}
                className="no-spinner"
              />
              <Input
                addonBefore={<span style={{ color: '#fff' }}>Burst Time</span>}
                placeholder="Enter burst time"
                type="number"
                min="1"
                value={burstTime}
                onChange={(e) => setBurstTime(e.target.value)}
                style={{ width: '200px' }}
                className="no-spinner"
              />
              <Button type="primary" onClick={addProcess}>
                Add Process
              </Button>
              <Button danger onClick={resetProcesses}>
                Reset
              </Button>
            </Space>

            <Divider orientation="left" style={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              borderColor: '#434343'
            }}>
              Process Schedule
            </Divider>

            <Table
              columns={columns}
              dataSource={processedResults}
              bordered
              pagination={false}
              style={{
                background: '#1f1f1f',
              }}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <Text strong style={{ color: '#fff' }}>
                        Average Waiting Time:
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">
                      <Text strong style={{ color: '#fff' }}>
                        {avgWaiting.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <Text strong style={{ color: '#fff' }}>
                        Average Turnaround Time:
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">
                      <Text strong style={{ color: '#fff' }}>
                        {avgTurnaround.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />

            <Divider orientation="left" style={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              borderColor: '#434343'
            }}>
              Execution Order
            </Divider>

            {getExecutionOrder()}
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
}