import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Users, FileText, DollarSign, ChevronDown, ChevronRight, Download, Edit2, Save, X, Plus, Trash2, Calendar } from 'lucide-react';

const BudgetTable = () => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingParticipants, setEditingParticipants] = useState(false);
  const [editingRates, setEditingRates] = useState(false);
  
  const [budgetData, setBudgetData] = useState(() => {
    // Load data from localStorage or use default
    const savedData = localStorage.getItem('budgetData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    return {
      managementCosts: [
        { id: 1, description: 'Проєктний менеджер', unit: 'Місяць', quantity: 4, salary: 3800, percentage: 35, totalUSD: 5320, totalUAH: 223440 },
        { id: 2, description: 'Керівник освітньої програми (Тетяна Водотика)', unit: 'Місяць', quantity: 4, salary: 6000, percentage: 20, totalUSD: 4800, totalUAH: 201600 },
        { id: 3, description: 'Бухгалтер', unit: 'День', quantity: 8, salary: '-', percentage: '-', totalUSD: 1000, totalUAH: 42000 },
        { id: 4, description: 'Фінансовий менеджер', unit: 'День', quantity: 8, salary: '-', percentage: '-', totalUSD: 1200, totalUAH: 50400 },
        { id: 5, description: 'Юрист', unit: 'День', quantity: 8, salary: '-', percentage: '-', totalUSD: 1000, totalUAH: 42000 }
      ],
      programStageCosts: [
        { id: 6, description: 'Етап 1: Підготовка', stageCost: 5096, totalUSD: 5096, totalUAH: 214032 },
        { id: 7, description: 'Етап 2: Дослідження + синтез', stageCost: 6136, totalUSD: 6136, totalUAH: 257712 },
        { id: 8, description: 'Етап 3: Презентація результатів, співтворення стратегії', stageCost: 5304, totalUSD: 5304, totalUAH: 222768 },
        { id: 9, description: 'Етап 4: Тестування', stageCost: 4056, totalUSD: 4056, totalUAH: 170352 },
        { id: 10, description: 'Етап 5: Фінальні презентації', stageCost: 1976, totalUSD: 1976, totalUAH: 82992 },
        { id: 11, description: 'Етап 6: Менторство', stageCost: 1248, totalUSD: 1248, totalUAH: 52416 },
        { id: 12, description: 'Етап 7: Звітність', stageCost: 1248, totalUSD: 1248, totalUAH: 52416 }
      ],
      expertsCosts: [
        { id: 13, description: 'Експерт з доступності (урбан дизайнер)', unit: 'Година', unitCost: 100, quantity: 11.5, totalUSD: 1150, totalUAH: 48300 },
        { id: 14, description: 'Експерт з mental health & spirituality & healing', unit: 'Година', unitCost: 100, quantity: 11.5, totalUSD: 1150, totalUAH: 48300 },
        { id: 15, description: 'Експерт з практик меморіалізації', unit: 'Година', unitCost: 100, quantity: 11.5, totalUSD: 1150, totalUAH: 48300 },
        { id: 16, description: 'Експерт з підходу AWP', unit: 'Година', unitCost: 100, quantity: 11.5, totalUSD: 1150, totalUAH: 48300 },
        { id: 17, description: 'Транспортні витрати експертів (8 поїздок)', unit: 'Поїздка', unitCost: 24, quantity: 8, totalUSD: 192, totalUAH: 8064 }
      ],
      materialsCosts: [
        { id: 18, description: 'Канцтовари для тренінгів', unit: 'Комплект', unitCost: 50, quantity: 5, totalUSD: 250, totalUAH: 10500 },
        { id: 19, description: 'Канцтовари для учасників', unit: 'Комплект', unitCost: 3, quantity: 125, totalUSD: 375, totalUAH: 15750, dependsOnParticipants: true, perParticipant: 5 },
        { id: 20, description: 'Друк сертифікатів', unit: 'Одиниця', unitCost: 1, quantity: 125, totalUSD: 125, totalUAH: 5250, dependsOnParticipants: true, perParticipant: 5 },
        { id: 21, description: 'Брендована продукція (блокноти, шопери, ручки)', unit: 'Комплект', unitCost: 1200, quantity: 1, totalUSD: 1200, totalUAH: 50400 }
      ],
      logisticsCosts: [
        { id: 22, description: 'Транспортні витрати учасників (таксі)', unit: 'Людина', unitCost: 7.14, quantity: 50, totalUSD: 357, totalUAH: 14994, dependsOnParticipants: true, perParticipant: 2 },
        { id: 23, description: 'Транспортні витрати команди (3 особи × 5 виїздів)', unit: 'Людина', unitCost: 23.81, quantity: 15, totalUSD: 357, totalUAH: 14994 }
      ],
      contractualServices: [
        { id: 25, description: 'Дизайн (матеріали та сертифікати)', unit: 'Година', unitCost: 50, quantity: 50, totalUSD: 2500, totalUAH: 105000 },
        { id: 26, description: 'Кейтеринг для учасників (25 × 4 дні + 10 воркшоп РГ)', unit: 'Людино-день', unitCost: 30, quantity: 110, totalUSD: 3300, totalUAH: 138600, dependsOnParticipants: true, perParticipant: 4.4 },
        { id: 27, description: 'Кейтеринг для експертів та команди', unit: 'Людино-день', unitCost: 30, quantity: 28, totalUSD: 840, totalUAH: 35280 }
      ],
      operatingCosts: [
        { id: 28, description: 'Оренда офісу', unit: 'Місяць', unitCost: 300, quantity: 4, totalUSD: 1200, totalUAH: 50400 }
      ]
    };
  });

  const [participantCount, setParticipantCount] = useState(() => {
    const saved = localStorage.getItem('participantCount');
    return saved ? parseInt(saved) : 25;
  });

  const [exchangeRates, setExchangeRates] = useState(() => {
    const saved = localStorage.getItem('exchangeRates');
    return saved ? JSON.parse(saved) : {
      EUR_TO_USD: 1.04,
      USD_TO_UAH: 42.0
    };
  });
  
  const categories = [
    { key: 'managementCosts', name: 'Менеджмент та адміністративні витрати', icon: Users, hasPercentage: true },
    { key: 'programStageCosts', name: 'Витрати на етапи програми', icon: FileText, isStages: true },
    { key: 'expertsCosts', name: 'Витрати на експертів', icon: Users },
    { key: 'materialsCosts', name: 'Матеріали та канцтовари', icon: FileText },
    { key: 'logisticsCosts', name: 'Логістика та проживання', icon: Users },
    { key: 'contractualServices', name: 'Контрактні послуги', icon: FileText },
    { key: 'operatingCosts', name: 'Операційні витрати', icon: DollarSign }
  ];

  const timeline = [
    {
      month: 'Серпень',
      activities: [
        'Етап 1: Підготовка',
        'Етап 2: Дослідження (глибинні інтерв\'ю з ветеранами, сім\'ями та іншими стейкхолдерами, партисипативні воркшопи) + синтез',
        'Формування Робочої групи (РГ)',
        'Навчання РГ з підходу AWP'
      ]
    },
    {
      month: 'Вересень',
      activities: [
        'Етап 3: Презентація результатів дослідження, співтворення стратегії',
        'Навчання про доступність (Експерт)',
        'Навчання про практики меморіалізації (Експерт)',
        'Навчання про mental health & spirituality & healing (Експерт)',
        'Навчання про комунікації (Серце Азовсталі)'
      ]
    },
    {
      month: 'Жовтень',
      activities: [
        'Напрацювання матеріалів з РГ',
        'Етап 4: Тестування (проведення громадських слухань та запрошуємо стейкхолдерів)',
        'Етап 5: Фінальні презентації матеріалів стратегії'
      ]
    },
    {
      month: 'Листопад',
      activities: [
        'Етап 6: Менторство',
        'Етап 7: Звітність та письмове оформлення досвіду'
      ]
    }
  ];

  const recalculateTotals = (data) => {
    const newData = { ...data };
    
    // Management costs
    newData.managementCosts = newData.managementCosts.map(item => {
      if (item.salary !== '-' && item.percentage !== '-') {
        const totalUSD = parseFloat(item.salary) * parseFloat(item.quantity) * (parseFloat(item.percentage) / 100);
        return {
          ...item,
          totalUSD: totalUSD,
          totalUAH: totalUSD * exchangeRates.USD_TO_UAH
        };
      }
      return {
        ...item,
        totalUAH: item.totalUSD * exchangeRates.USD_TO_UAH
      };
    });

    // Other categories
    Object.keys(newData).forEach(key => {
      if (key !== 'managementCosts' && key !== 'programStageCosts') {
        newData[key] = newData[key].map(item => {
          let quantity = parseFloat(item.quantity || 0);
          
          // Update quantity for participant-dependent items
          if (item.dependsOnParticipants && item.perParticipant) {
            quantity = participantCount * item.perParticipant;
          }
          
          const totalUSD = parseFloat(item.unitCost || 0) * quantity;
          return {
            ...item,
            quantity: quantity,
            totalUSD: totalUSD,
            totalUAH: totalUSD * exchangeRates.USD_TO_UAH
          };
        });
      } else if (key === 'programStageCosts') {
        newData[key] = newData[key].map(item => ({
          ...item,
          totalUSD: parseFloat(item.stageCost || 0),
          totalUAH: parseFloat(item.stageCost || 0) * exchangeRates.USD_TO_UAH
        }));
      }
    });

    return newData;
  };

  const updateParticipantDependentItems = () => {
    setBudgetData(prev => recalculateTotals(prev));
  };

  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleEdit = (categoryKey, itemId, field, value) => {
    setBudgetData(prev => {
      const newData = { ...prev };
      newData[categoryKey] = newData[categoryKey].map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });
      const recalculatedData = recalculateTotals(newData);
      saveToLocalStorage('budgetData', recalculatedData);
      return recalculatedData;
    });
  };

  const handleExchangeRateChange = (rateKey, value) => {
    const newRates = {
      ...exchangeRates,
      [rateKey]: parseFloat(value) || 0
    };
    setExchangeRates(newRates);
    saveToLocalStorage('exchangeRates', newRates);
  };

  const handleParticipantCountChange = (newCount) => {
    setParticipantCount(newCount);
    saveToLocalStorage('participantCount', newCount);
  };

  const addRow = (categoryKey) => {
    const newId = Math.max(...budgetData[categoryKey].map(item => item.id)) + 1;
    const category = categories.find(cat => cat.key === categoryKey);
    
    let newRow;
    if (category.isStages) {
      newRow = {
        id: newId,
        description: 'Новий етап',
        stageCost: 0,
        totalUSD: 0,
        totalUAH: 0
      };
    } else if (category.hasPercentage) {
      newRow = {
        id: newId,
        description: 'Нова позиція',
        unit: 'Місяць',
        quantity: 1,
        salary: 0,
        percentage: 100,
        totalUSD: 0,
        totalUAH: 0
      };
    } else {
      newRow = {
        id: newId,
        description: 'Нова позиція',
        unit: 'Одиниця',
        unitCost: 0,
        quantity: 1,
        totalUSD: 0,
        totalUAH: 0
      };
    }

    setBudgetData(prev => {
      const newData = {
        ...prev,
        [categoryKey]: [...prev[categoryKey], newRow]
      };
      saveToLocalStorage('budgetData', newData);
      return newData;
    });
  };

  const deleteRow = (categoryKey, itemId) => {
    setBudgetData(prev => {
      const newData = {
        ...prev,
        [categoryKey]: prev[categoryKey].filter(item => item.id !== itemId)
      };
      saveToLocalStorage('budgetData', newData);
      return newData;
    });
  };

  const categoryTotals = useMemo(() => {
    const totals = {};
    categories.forEach(cat => {
      totals[cat.key] = budgetData[cat.key].reduce((sum, item) => sum + (item.totalUSD || 0), 0);
    });
    return totals;
  }, [budgetData]);

  const grandTotal = useMemo(() => {
    return Object.values(categoryTotals).reduce((sum, total) => sum + total, 0);
  }, [categoryTotals]);

  const toggleCategory = (key) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const exportToCSV = () => {
    let csv = 'Категорія,Опис,Одиниця,Вартість/Зарплата ($),Кількість,%,Загалом ($),Загалом (₴)\n';
    
    categories.forEach(cat => {
      csv += `"${cat.name}",,,,,,${categoryTotals[cat.key].toFixed(2)},${(categoryTotals[cat.key] * exchangeRates.USD_TO_UAH).toFixed(2)}\n`;
      budgetData[cat.key].forEach(item => {
        if (cat.isStages) {
          csv += `,"${item.description}",,"${item.stageCost}",,,${item.totalUSD.toFixed(2)},${item.totalUAH.toFixed(2)}\n`;
        } else if (cat.hasPercentage) {
          csv += `,"${item.description}","${item.unit}","${item.salary}",${item.quantity},${item.percentage},${item.totalUSD.toFixed(2)},${item.totalUAH.toFixed(2)}\n`;
        } else {
          csv += `,"${item.description}","${item.unit}",${item.unitCost},${item.quantity},,${item.totalUSD.toFixed(2)},${item.totalUAH.toFixed(2)}\n`;
        }
      });
      csv += '\n';
    });
    
    csv += `\nЗагальний бюджет,,,,,,${grandTotal.toFixed(2)},${(grandTotal * exchangeRates.USD_TO_UAH).toFixed(2)}\n`;
    csv += `Вартість на учасника,,,,,,${(grandTotal / participantCount).toFixed(2)},${((grandTotal * exchangeRates.USD_TO_UAH) / participantCount).toFixed(2)}\n`;
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'budget_veterans_program.csv';
    link.click();
  };

  const exportToPrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Бюджет програми реінтеграції ветеранів</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { font-size: 20px; margin-bottom: 10px; }
          h2 { font-size: 16px; margin: 20px 0 10px 0; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .text-right { text-align: right; }
          .total-row { font-weight: bold; background-color: #f9f9f9; }
          @media print {
            body { margin: 0; }
            table { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>Бюджет програми реінтеграції ветеранів у громади</h1>
        <p>Кількість учасників: ${participantCount}</p>
        <p>Курс: 1 USD = ${exchangeRates.USD_TO_UAH} UAH</p>
        
        ${categories.map(cat => {
          const categoryTotal = categoryTotals[cat.key];
          let tableHTML = `<h2>${cat.name}</h2><table>`;
          
          if (cat.isStages) {
            tableHTML += '<tr><th>Опис</th><th class="text-right">Вартість етапу ($)</th><th class="text-right">Загалом ($)</th><th class="text-right">Загалом (₴)</th></tr>';
            budgetData[cat.key].forEach(item => {
              tableHTML += `<tr>
                <td>${item.description}</td>
                <td class="text-right">${item.stageCost}</td>
                <td class="text-right">${item.totalUSD.toFixed(2)}</td>
                <td class="text-right">${item.totalUAH.toFixed(2)}</td>
              </tr>`;
            });
          } else if (cat.hasPercentage) {
            tableHTML += '<tr><th>Опис</th><th>Одиниця</th><th class="text-right">Кількість</th><th class="text-right">Зарплата ($)</th><th class="text-right">%</th><th class="text-right">Загалом ($)</th><th class="text-right">Загалом (₴)</th></tr>';
            budgetData[cat.key].forEach(item => {
              tableHTML += `<tr>
                <td>${item.description}</td>
                <td>${item.unit}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${item.salary}</td>
                <td class="text-right">${item.percentage}</td>
                <td class="text-right">${item.totalUSD.toFixed(2)}</td>
                <td class="text-right">${item.totalUAH.toFixed(2)}</td>
              </tr>`;
            });
          } else {
            tableHTML += '<tr><th>Опис</th><th>Одиниця</th><th class="text-right">Вартість ($)</th><th class="text-right">Кількість</th><th class="text-right">Загалом ($)</th><th class="text-right">Загалом (₴)</th></tr>';
            budgetData[cat.key].forEach(item => {
              tableHTML += `<tr>
                <td>${item.description}</td>
                <td>${item.unit}</td>
                <td class="text-right">${item.unitCost}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${item.totalUSD.toFixed(2)}</td>
                <td class="text-right">${item.totalUAH.toFixed(2)}</td>
              </tr>`;
            });
          }
          
          tableHTML += `<tr class="total-row">
            <td colspan="${cat.isStages ? 2 : cat.hasPercentage ? 5 : 4}">Підсумок по категорії:</td>
            <td class="text-right">$${categoryTotal.toFixed(2)}</td>
            <td class="text-right">₴${(categoryTotal * exchangeRates.USD_TO_UAH).toFixed(2)}</td>
          </tr></table>`;
          
          return tableHTML;
        }).join('')}
        
        <h2>Загальний бюджет: $${grandTotal.toFixed(2)} (₴${(grandTotal * exchangeRates.USD_TO_UAH).toFixed(2)})</h2>
        <p>Вартість на учасника: $${(grandTotal / participantCount).toFixed(2)} (₴${((grandTotal * exchangeRates.USD_TO_UAH) / participantCount).toFixed(2)})</p>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const EditableCell = ({ categoryKey, itemId, field, value, type = 'text' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
      handleEdit(categoryKey, itemId, field, tempValue);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setTempValue(value);
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full px-1 py-0.5 border rounded text-sm text-right"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
          <button onClick={handleSave} className="text-green-600 hover:text-green-800">
            <Save size={14} />
          </button>
          <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
            <X size={14} />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <span className={type === 'number' ? 'text-right w-full' : ''}>
          {type === 'number' ? value.toLocaleString('uk-UA') : value}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 ml-2"
        >
          <Edit2 size={14} />
        </button>
      </div>
    );
  };

  useEffect(() => {
    updateParticipantDependentItems();
  }, [participantCount, exchangeRates]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Бюджет програми реінтеграції ветеранів у громади
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-gray-600">Програма розвитку спроможності для</span>
                {editingParticipants ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={participantCount}
                      onChange={(e) => handleParticipantCountChange(parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border rounded"
                    />
                    <button
                      onClick={() => setEditingParticipants(false)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Save size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{participantCount}</span>
                    <button
                      onClick={() => setEditingParticipants(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <span className="text-gray-600">учасників</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">Курси валют:</span>
                {editingRates ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">1 EUR =</span>
                      <input
                        type="number"
                        step="0.01"
                        value={exchangeRates.EUR_TO_USD}
                        onChange={(e) => handleExchangeRateChange('EUR_TO_USD', e.target.value)}
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                      <span className="text-sm text-gray-600">USD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">1 USD =</span>
                      <input
                        type="number"
                        step="0.01"
                        value={exchangeRates.USD_TO_UAH}
                        onChange={(e) => handleExchangeRateChange('USD_TO_UAH', e.target.value)}
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                      <span className="text-sm text-gray-600">UAH</span>
                    </div>
                    <button
                      onClick={() => setEditingRates(false)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Save size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      1 EUR = {exchangeRates.EUR_TO_USD} USD | 1 USD = {exchangeRates.USD_TO_UAH} UAH
                    </span>
                    <button
                      onClick={() => setEditingRates(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={20} />
                CSV
              </button>
              <button
                onClick={exportToPrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
                Друк/PDF
              </button>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">Таймлайн програми</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {timeline.map((period, idx) => (
                <div key={idx} className="bg-white p-3 rounded">
                  <h4 className="font-bold text-blue-800 mb-2">{period.month}</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {period.activities.map((activity, i) => (
                      <li key={i} className="pl-2 border-l-2 border-blue-300">{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calculator size={20} />
                <span className="font-medium">Загальний бюджет</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">
                ${grandTotal.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-blue-600">
                ₴{(grandTotal * exchangeRates.USD_TO_UAH).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Users size={20} />
                <span className="font-medium">Кількість учасників</span>
              </div>
              <div className="text-2xl font-bold text-green-800">{participantCount}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <DollarSign size={20} />
                <span className="font-medium">Вартість на учасника</span>
              </div>
              <div className="text-2xl font-bold text-purple-800">
                ${(grandTotal / participantCount).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-purple-600">
                ₴{((grandTotal * exchangeRates.USD_TO_UAH) / participantCount).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {categories.map(category => {
              const Icon = category.icon;
              const isExpanded = expandedCategories[category.key];
              const categoryTotal = categoryTotals[category.key];

              return (
                <div key={category.key} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleCategory(category.key)}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      <Icon size={20} className="text-gray-600" />
                      <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800">
                        ${categoryTotal.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-gray-600">
                        ₴{(categoryTotal * exchangeRates.USD_TO_UAH).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Опис</th>
                            {!category.isStages && (
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Одиниця</th>
                            )}
                            {category.isStages ? (
                              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Вартість етапу ($)</th>
                            ) : category.hasPercentage ? (
                              <>
                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Кількість</th>
                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Зарплата ($)</th>
                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">%</th>
                              </>
                            ) : (
                              <>
                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Вартість ($)</th>
                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Кількість</th>
                              </>
                            )}
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Загалом ($)</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Загалом (₴)</th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Дії</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {budgetData[category.key].map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                <EditableCell
                                  categoryKey={category.key}
                                  itemId={item.id}
                                  field="description"
                                  value={item.description}
                                />
                              </td>
                              {!category.isStages && (
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  <EditableCell
                                    categoryKey={category.key}
                                    itemId={item.id}
                                    field="unit"
                                    value={item.unit}
                                  />
                                </td>
                              )}
                              {category.isStages ? (
                                <td className="px-4 py-3 text-sm text-gray-800 text-right">
                                  <EditableCell
                                    categoryKey={category.key}
                                    itemId={item.id}
                                    field="stageCost"
                                    value={item.stageCost}
                                    type="number"
                                  />
                                </td>
                              ) : category.hasPercentage ? (
                                <>
                                  <td className="px-4 py-3 text-sm text-gray-800 text-right">
                                    <EditableCell
                                      categoryKey={category.key}
                                      itemId={item.id}
                                      field="quantity"
                                      value={item.quantity}
                                      type="number"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-800 text-right">
                                    <EditableCell
                                      categoryKey={category.key}
                                      itemId={item.id}
                                      field="salary"
                                      value={item.salary}
                                      type="number"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-800 text-right">
                                    <EditableCell
                                      categoryKey={category.key}
                                      itemId={item.id}
                                      field="percentage"
                                      value={item.percentage}
                                      type="number"
                                    />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-4 py-3 text-sm text-gray-800 text-right">
                                    <EditableCell
                                      categoryKey={category.key}
                                      itemId={item.id}
                                      field="unitCost"
                                      value={item.unitCost}
                                      type="number"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-800 text-right">
                                    <EditableCell
                                      categoryKey={category.key}
                                      itemId={item.id}
                                      field="quantity"
                                      value={item.quantity}
                                      type="number"
                                    />
                                  </td>
                                </>
                              )}
                              <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                                ${item.totalUSD.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 text-right">
                                ₴{item.totalUAH.toLocaleString('uk-UA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => deleteRow(category.key, item.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Видалити рядок"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="p-4 border-t border-gray-200">
                        <button
                          onClick={() => addRow(category.key)}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Plus size={16} />
                          Додати рядок
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Загальний бюджет проєкту:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900 block">
                  ${grandTotal.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-lg text-gray-700">
                  ₴{(grandTotal * exchangeRates.USD_TO_UAH).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTable; 