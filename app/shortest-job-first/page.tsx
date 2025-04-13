"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react';
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

export default function SJFScheduler() {
  const [arrivalTime, setArrivalTime] = useState<string>('');
  const [burstTime, setBurstTime] = useState<string>('');
  const [processes, setProcesses] = useState<Process[]>([]);
  const [nextId, setNextId] = useState<number>(1);

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

    let updatedProcesses = [...processes, newProcess]
      .sort((a, b) => a.burstTime - b.burstTime || a.originalId - b.originalId);

    updatedProcesses = calculateSJF(updatedProcesses);

    setProcesses(updatedProcesses);
    setNextId(nextId + 1);
    setArrivalTime('');
    setBurstTime('');
  };

  const calculateSJF = (processes: Process[]): Process[] => {
    let completionTime = 0;
    return processes.map((process, index) => {
      
      completionTime += process.burstTime;
      

      const turnaroundTime = completionTime;
      const waitingTime = completionTime - process.burstTime;

      return {
        ...process,
        turnaroundTime,
        waitingTime,
      };
    });
  };

  const resetProcesses = () => {
    setProcesses([]);
    setNextId(1);
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
    if (processes.length === 0) return { avgWaiting: 0, avgTurnaround: 0 };

    const totalWaiting = processes.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurnaround = processes.reduce((sum, p) => sum + p.turnaroundTime, 0);

    return {
      avgWaiting: totalWaiting / processes.length,
      avgTurnaround: totalTurnaround / processes.length,
    };
  };

  const { avgWaiting, avgTurnaround } = calculateAverages();

  const getExecutionOrder = () => {
    if (processes.length === 0) return null;
    
    const sortedProcesses = [...processes].sort((a, b) => 
      a.burstTime - b.burstTime || a.originalId - b.originalId);
    
    return (
      <div className='flex items-center justify-center'>
        <Space size={4}>
          {sortedProcesses.map((process, index) => (
            <Space key={process.key} size={4} align="center">
              <Tag 
                color="geekblue"
                style={{ 
                  background: '#1f1f1f',
                  borderColor: '#434343',
                  color: '#fff'
                }}
              >
                {process.processId}
              </Tag>
              {index < sortedProcesses.length - 1 && (
                <RightOutlined style={{ color: '#fff' }} />
              )}
            </Space>
          ))}
        </Space>
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
              Shortest Job First Scheduler
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
              Shortest Job First (SJF) is a scheduling algorithm that selects the waiting process with the smallest execution time to execute next.
              This algorithm minimizes the average waiting time for processes.
            </Text>

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
                className="no-spinner w-[25px]"
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
              dataSource={processes}
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