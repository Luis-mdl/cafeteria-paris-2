// Aplicación principal Análisis Fudo
const app = {
    currentSection: 'dashboard',
    charts: {},
    demoData: null,
    processedData: null
};

// Generador de datos de muestra para octubre 2025
function generateDemoData() {
    const products = [
        // Bebidas
        { id: 'P-001', name: 'Café Latte 12oz', category: 'Bebidas', basePrice: 3200, baseCost: 1200 },
        { id: 'P-002', name: 'Cappuccino 12oz', category: 'Bebidas', basePrice: 3000, baseCost: 1100 },
        { id: 'P-003', name: 'Americano 12oz', category: 'Bebidas', basePrice: 2500, baseCost: 900 },
        { id: 'P-004', name: 'Espresso Doble', category: 'Bebidas', basePrice: 2200, baseCost: 800 },
        { id: 'P-005', name: 'Mocha 16oz', category: 'Bebidas', basePrice: 3800, baseCost: 1400 },
        { id: 'P-006', name: 'Chocolate Caliente', category: 'Bebidas', basePrice: 3500, baseCost: 1300 },
        { id: 'P-007', name: 'Té Verde', category: 'Bebidas', basePrice: 2000, baseCost: 600 },
        { id: 'P-008', name: 'Frappuccino', category: 'Bebidas', basePrice: 4200, baseCost: 1600 },
        { id: 'P-009', name: 'Jugo Natural', category: 'Bebidas', basePrice: 3000, baseCost: 1200 },
        // Pastelería
        { id: 'P-010', name: 'Croissant', category: 'Pastelería', basePrice: 2500, baseCost: 1000 },
        { id: 'P-011', name: 'Muffin Arándanos', category: 'Pastelería', basePrice: 2800, baseCost: 1100 },
        { id: 'P-012', name: 'Tarta de Frutas', category: 'Pastelería', basePrice: 3500, baseCost: 1400 },
        { id: 'P-013', name: 'Brownie', category: 'Pastelería', basePrice: 2200, baseCost: 900 },
        { id: 'P-014', name: 'Cheesecake', category: 'Pastelería', basePrice: 3800, baseCost: 1500 },
        { id: 'P-015', name: 'Cookie Chips', category: 'Pastelería', basePrice: 1800, baseCost: 700 },
        { id: 'P-016', name: 'Donut Glaseada', category: 'Pastelería', basePrice: 2000, baseCost: 800 },
        // Sandwiches
        { id: 'P-017', name: 'Club Sandwich', category: 'Sandwiches', basePrice: 5500, baseCost: 2200 },
        { id: 'P-018', name: 'Sandwich Pollo', category: 'Sandwiches', basePrice: 4800, baseCost: 1900 },
        { id: 'P-019', name: 'Wrap Vegetariano', category: 'Sandwiches', basePrice: 4200, baseCost: 1600 },
        { id: 'P-020', name: 'Panini Jamón Queso', category: 'Sandwiches', basePrice: 4500, baseCost: 1800 },
        { id: 'P-021', name: 'Bagel Salmón', category: 'Sandwiches', basePrice: 6200, baseCost: 2500 },
        { id: 'P-022', name: 'Sandwich Atún', category: 'Sandwiches', basePrice: 4000, baseCost: 1600 },
        // Grano
        { id: 'P-023', name: 'Café Grano 250g', category: 'Grano', basePrice: 8500, baseCost: 3400 },
        { id: 'P-024', name: 'Café Grano 500g', category: 'Grano', basePrice: 15000, baseCost: 6000 },
        { id: 'P-025', name: 'Café Grano 1kg', category: 'Grano', basePrice: 28000, baseCost: 11200 }
    ];

    const branches = ['París Centro', 'Providencia', 'Las Condes', 'Vitacura'];
    const sales = [];
    let txnCounter = 1;

    // Generar ventas para cada día de octubre
    for (let day = 1; day <= 31; day++) {
        const dayOfWeek = new Date(2025, 9, day).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Más transacciones los fines de semana
        const baseTransactions = isWeekend ? 100 : 80;
        const transactionsToday = baseTransactions + Math.floor(Math.random() * 40);
        
        for (let t = 0; t < transactionsToday; t++) {
            const hour = Math.floor(Math.random() * 14) + 7; // 7am a 9pm
            const minute = Math.floor(Math.random() * 60);
            const second = Math.floor(Math.random() * 60);
            
            const txnId = `T-${String(txnCounter++).padStart(6, '0')}`;
            const itemsInTransaction = Math.floor(Math.random() * 4) + 1; // 1-4 items por transacción
            
            for (let i = 0; i < itemsInTransaction; i++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const branch = branches[Math.floor(Math.random() * branches.length)];
                const qty = Math.random() > 0.7 ? 2 : 1; // 30% chance de comprar 2 unidades
                
                // Aplicar descuentos ocasionales
                const hasDiscount = Math.random() > 0.85; // 15% de probabilidad
                const discountAmount = hasDiscount ? Math.floor(product.basePrice * 0.1) : 0;
                
                sales.push({
                    date: `${String(day).padStart(2, '0')}/10/2025 ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
                    txn_id: txnId,
                    product_id: product.id,
                    product: product.name,
                    category: product.category,
                    branch: branch,
                    qty: qty,
                    price_unit: product.basePrice,
                    cost_unit: product.baseCost,
                    discount_line: discountAmount * qty
                });
            }
        }
    }

    return { sales };
}

// Procesar datos para análisis
function processData(data) {
    const processed = {
        totalSales: 0,
        totalCost: 0,
        totalMargin: 0,
        transactionCount: new Set(),
        productSummary: {},
        categorySummary: {},
        branchSummary: {},
        dailySales: {},
        hourlySales: Array(24).fill(0),
        weeklyComparison: []
    };

    data.sales.forEach(sale => {
        const revenue = (sale.price_unit * sale.qty) - sale.discount_line;
        const cost = sale.cost_unit * sale.qty;
        const margin = revenue - cost;
        
        processed.totalSales += revenue;
        processed.totalCost += cost;
        processed.totalMargin += margin;
        processed.transactionCount.add(sale.txn_id);
        
        // Por producto
        if (!processed.productSummary[sale.product]) {
            processed.productSummary[sale.product] = {
                category: sale.category,
                qty: 0,
                revenue: 0,
                cost: 0,
                margin: 0
            };
        }
        processed.productSummary[sale.product].qty += sale.qty;
        processed.productSummary[sale.product].revenue += revenue;
        processed.productSummary[sale.product].cost += cost;
        processed.productSummary[sale.product].margin += margin;
        
        // Por categoría
        if (!processed.categorySummary[sale.category]) {
            processed.categorySummary[sale.category] = {
                qty: 0,
                revenue: 0,
                cost: 0,
                margin: 0
            };
        }
        processed.categorySummary[sale.category].qty += sale.qty;
        processed.categorySummary[sale.category].revenue += revenue;
        processed.categorySummary[sale.category].cost += cost;
        processed.categorySummary[sale.category].margin += margin;
        
        // Por sucursal
        if (!processed.branchSummary[sale.branch]) {
            processed.branchSummary[sale.branch] = {
                qty: 0,
                revenue: 0,
                transactions: new Set()
            };
        }
        processed.branchSummary[sale.branch].qty += sale.qty;
        processed.branchSummary[sale.branch].revenue += revenue;
        processed.branchSummary[sale.branch].transactions.add(sale.txn_id);
        
        // Ventas diarias
        const dateKey = sale.date.split(' ')[0];
        if (!processed.dailySales[dateKey]) {
            processed.dailySales[dateKey] = 0;
        }
        processed.dailySales[dateKey] += revenue;
        
        // Ventas por hora
        const hour = parseInt(sale.date.split(' ')[1].split(':')[0]);
        processed.hourlySales[hour] += revenue;
    });
    
    // Calcular comparación semanal
    for (let week = 0; week < 4; week++) {
        let weekTotal = 0;
        const startDay = week * 7 + 1;
        const endDay = Math.min(startDay + 6, 31);
        
        for (let day = startDay; day <= endDay; day++) {
            const dateKey = `${String(day).padStart(2, '0')}/10/2025`;
            weekTotal += processed.dailySales[dateKey] || 0;
        }
        processed.weeklyComparison.push({
            week: `Semana ${week + 1}`,
            total: weekTotal
        });
    }
    
    processed.avgTicket = processed.totalSales / processed.transactionCount.size;
    processed.marginPercent = (processed.totalMargin / processed.totalSales) * 100;
    
    return processed;
}

// Formatear moneda CLP
function formatCLP(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Actualizar KPIs
function updateKPIs() {
    const data = app.processedData;
    
    document.getElementById('kpi-total-sales').textContent = formatCLP(data.totalSales);
    document.getElementById('kpi-transactions').textContent = data.transactionCount.size.toLocaleString('es-CL');
    document.getElementById('kpi-transactions').nextElementSibling.textContent = 
        `${Math.round(data.transactionCount.size / 31)} por día`;
    document.getElementById('kpi-avg-ticket').textContent = formatCLP(data.avgTicket);
    document.getElementById('kpi-margin').textContent = `${data.marginPercent.toFixed(1)}%`;
    document.getElementById('kpi-margin-value').textContent = formatCLP(data.totalMargin);
}

// Crear gráficos
function createCharts() {
    const data = app.processedData;
    
    // Gráfico de ventas diarias
    const dailyLabels = Object.keys(data.dailySales).map(d => `${d.split('/')[0]} Oct`);
    const dailyValues = Object.values(data.dailySales);
    
    const ctx1 = document.getElementById('dailySalesChart').getContext('2d');
    app.charts.dailySales = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: dailyLabels,
            datasets: [{
                label: 'Ventas',
                data: dailyValues,
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return formatCLP(value);
                        }
                    }
                }
            }
        }
    });
    
    // Gráfico de categorías
    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    const categoryLabels = Object.keys(data.categorySummary);
    const categoryValues = categoryLabels.map(c => data.categorySummary[c].revenue);
    
    app.charts.category = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryValues,
                backgroundColor: ['#4361ee', '#f72585', '#06ffa5', '#ffbe0b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Actualizar tabla de top productos
function updateTopProducts() {
    const data = app.processedData;
    const products = Object.entries(data.productSummary)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 10);
    
    const tbody = document.querySelector('#topProductsTable tbody');
    tbody.innerHTML = products.map(([name, stats]) => `
        <tr>
            <td>${name}</td>
            <td>${stats.category}</td>
            <td>${stats.qty}</td>
            <td>${formatCLP(stats.revenue)}</td>
            <td>${((stats.margin / stats.revenue) * 100).toFixed(1)}%</td>
        </tr>
    `).join('');
}

// Crear gráficos adicionales para la sección Charts
function createAdditionalCharts() {
    const data = app.processedData;
    
    // Tendencia de ventas
    const ctx3 = document.getElementById('trendChart')?.getContext('2d');
    if (ctx3) {
        const dailyLabels = Object.keys(data.dailySales);
        const dailyValues = Object.values(data.dailySales);
        
        // Calcular promedio móvil
        const movingAvg = [];
        for (let i = 0; i < dailyValues.length; i++) {
            const start = Math.max(0, i - 3);
            const end = Math.min(dailyValues.length, i + 4);
            const avg = dailyValues.slice(start, end).reduce((a, b) => a + b, 0) / (end - start);
            movingAvg.push(avg);
        }
        
        app.charts.trend = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: dailyLabels.map(d => `${d.split('/')[0]}/10`),
                datasets: [{
                    label: 'Ventas Diarias',
                    data: dailyValues,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.1
                }, {
                    label: 'Promedio Móvil',
                    data: movingAvg,
                    borderColor: '#f72585',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return formatCLP(value);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de sucursales
    const ctx4 = document.getElementById('branchChart')?.getContext('2d');
    if (ctx4) {
        const branchLabels = Object.keys(data.branchSummary);
        const branchValues = branchLabels.map(b => data.branchSummary[b].revenue);
        
        app.charts.branch = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: branchLabels,
                datasets: [{
                    label: 'Ventas por Sucursal',
                    data: branchValues,
                    backgroundColor: '#4361ee'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return formatCLP(value);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Heatmap por hora
    const ctx5 = document.getElementById('heatmapChart')?.getContext('2d');
    if (ctx5) {
        const hourLabels = Array.from({length: 24}, (_, i) => `${i}:00`);
        
        app.charts.heatmap = new Chart(ctx5, {
            type: 'bar',
            data: {
                labels: hourLabels,
                datasets: [{
                    label: 'Ventas por Hora',
                    data: data.hourlySales,
                    backgroundColor: data.hourlySales.map(v => {
                        const intensity = v / Math.max(...data.hourlySales);
                        return `rgba(67, 97, 238, ${intensity})`;
                    })
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return formatCLP(value);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Análisis de margen
    const ctx6 = document.getElementById('marginAnalysisChart')?.getContext('2d');
    if (ctx6) {
        const categoryLabels = Object.keys(data.categorySummary);
        const margins = categoryLabels.map(c => 
            (data.categorySummary[c].margin / data.categorySummary[c].revenue) * 100
        );
        
        app.charts.marginAnalysis = new Chart(ctx6, {
            type: 'radar',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: 'Margen %',
                    data: margins,
                    backgroundColor: 'rgba(67, 97, 238, 0.2)',
                    borderColor: '#4361ee',
                    pointBackgroundColor: '#4361ee'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 80
                    }
                }
            }
        });
    }
    
    // Comparación semanal
    const ctx7 = document.getElementById('weeklyComparisonChart')?.getContext('2d');
    if (ctx7) {
        app.charts.weeklyComparison = new Chart(ctx7, {
            type: 'bar',
            data: {
                labels: data.weeklyComparison.map(w => w.week),
                datasets: [{
                    label: 'Ventas Semanales',
                    data: data.weeklyComparison.map(w => w.total),
                    backgroundColor: ['#4361ee', '#f72585', '#06ffa5', '#ffbe0b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return formatCLP(value);
                            }
                        }
                    }
                }
            }
        });
    }
}

// Generar informe
app.generateReport = function() {
    const data = app.processedData;
    const reportContent = document.getElementById('reportContent');
    
    // Top 5 productos
    const topProducts = Object.entries(data.productSummary)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5);
    
    // Bottom 5 productos
    const bottomProducts = Object.entries(data.productSummary)
        .sort((a, b) => a[1].revenue - b[1].revenue)
        .slice(0, 5);
    
    // Mejor sucursal
    const bestBranch = Object.entries(data.branchSummary)
        .sort((a, b) => b[1].revenue - a[1].revenue)[0];
    
    // Mejor categoría
    const bestCategory = Object.entries(data.categorySummary)
        .sort((a, b) => b[1].revenue - a[1].revenue)[0];
    
    const reportHTML = `
        <div class="report-section">
            <h3>📊 Resumen Ejecutivo - Octubre 2025</h3>
            <p>Durante el mes de octubre de 2025, el análisis de ventas muestra un rendimiento sólido con oportunidades claras de mejora. A continuación se presenta un resumen detallado de los principales indicadores y hallazgos.</p>
            
            <h4>Indicadores Clave de Rendimiento (KPIs)</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Indicador</th>
                        <th>Valor</th>
                        <th>Análisis</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ventas Totales</td>
                        <td>${formatCLP(data.totalSales)}</td>
                        <td>Resultado positivo para el período</td>
                    </tr>
                    <tr>
                        <td>Transacciones</td>
                        <td>${data.transactionCount.size.toLocaleString('es-CL')}</td>
                        <td>Promedio de ${Math.round(data.transactionCount.size / 31)} transacciones diarias</td>
                    </tr>
                    <tr>
                        <td>Ticket Promedio</td>
                        <td>${formatCLP(data.avgTicket)}</td>
                        <td>Oportunidad de incrementar mediante venta cruzada</td>
                    </tr>
                    <tr>
                        <td>Margen Bruto</td>
                        <td>${data.marginPercent.toFixed(1)}%</td>
                        <td>${formatCLP(data.totalMargin)} en utilidad bruta</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="report-section">
            <h4>Análisis de Productos</h4>
            <p><strong>Top 5 Productos Más Vendidos:</strong></p>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Ventas</th>
                        <th>Margen</th>
                    </tr>
                </thead>
                <tbody>
                    ${topProducts.map(([name, stats]) => `
                        <tr>
                            <td>${name}</td>
                            <td>${stats.category}</td>
                            <td>${formatCLP(stats.revenue)}</td>
                            <td>${((stats.margin / stats.revenue) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <p><strong>Productos con Menor Desempeño:</strong></p>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Ventas</th>
                        <th>Unidades</th>
                    </tr>
                </thead>
                <tbody>
                    ${bottomProducts.map(([name, stats]) => `
                        <tr>
                            <td>${name}</td>
                            <td>${stats.category}</td>
                            <td>${formatCLP(stats.revenue)}</td>
                            <td>${stats.qty}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="report-section">
            <h4>Análisis por Categoría</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Ventas</th>
                        <th>Margen %</th>
                        <th>Participación</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(data.categorySummary).map(([cat, stats]) => `
                        <tr>
                            <td>${cat}</td>
                            <td>${formatCLP(stats.revenue)}</td>
                            <td>${((stats.margin / stats.revenue) * 100).toFixed(1)}%</td>
                            <td>${((stats.revenue / data.totalSales) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="report-section">
            <h4>Análisis por Sucursal</h4>
            <p>La sucursal con mejor desempeño fue <strong>${bestBranch[0]}</strong> con ventas de <strong>${formatCLP(bestBranch[1].revenue)}</strong> y ${bestBranch[1].transactions.size} transacciones.</p>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Sucursal</th>
                        <th>Ventas</th>
                        <th>Transacciones</th>
                        <th>Ticket Promedio</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(data.branchSummary).map(([branch, stats]) => `
                        <tr>
                            <td>${branch}</td>
                            <td>${formatCLP(stats.revenue)}</td>
                            <td>${stats.transactions.size}</td>
                            <td>${formatCLP(stats.revenue / stats.transactions.size)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="report-section">
            <h4>Conclusiones y Recomendaciones</h4>
            <ol>
                <li><strong>Optimización de Inventario:</strong> Los productos de la categoría "${bestCategory[0]}" representan el ${((bestCategory[1].revenue / data.totalSales) * 100).toFixed(1)}% de las ventas. Se recomienda asegurar stock suficiente.</li>
                
                <li><strong>Promociones Estratégicas:</strong> Los productos con menor rotación podrían beneficiarse de promociones 2x1 o descuentos del 20% para incrementar su movimiento.</li>
                
                <li><strong>Incrementar Ticket Promedio:</strong> Con un ticket actual de ${formatCLP(data.avgTicket)}, existe oportunidad de implementar combos y ventas cruzadas para alcanzar ${formatCLP(data.avgTicket * 1.2)}.</li>
                
                <li><strong>Foco en Horarios Pico:</strong> Reforzar personal en los horarios de mayor demanda identificados para mejorar el servicio.</li>
                
                <li><strong>Expansión de Categorías de Alto Margen:</strong> Las categorías con márgenes superiores al ${data.marginPercent.toFixed(0)}% deben priorizarse en la estrategia de ventas.</li>
            </ol>
        </div>
        
        <div class="report-section">
            <p style="text-align: center; margin-top: 2rem; color: var(--text-secondary);">
                <em>Informe generado automáticamente el ${new Date().toLocaleDateString('es-CL')} a las ${new Date().toLocaleTimeString('es-CL')}</em>
            </p>
        </div>
    `;
    
    reportContent.innerHTML = reportHTML;
};

// Exportar informe (simulado)
app.exportReport = function() {
    alert('Función de exportación a PDF simulada. En producción, esto generaría un archivo PDF descargable.');
};

// Sistema de asistente
app.askAssistant = function(question) {
    document.getElementById('chatInput').value = question;
    app.sendMessage();
};

app.sendMessage = function() {
    const input = document.getElementById('chatInput');
    const question = input.value.trim();
    if (!question) return;
    
    const chatWindow = document.getElementById('chatWindow');
    
    // Agregar mensaje del usuario
    chatWindow.innerHTML += `
        <div class="chat-message user">
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${question}</p>
            </div>
        </div>
    `;
    
    // Procesar pregunta y generar respuesta
    const response = app.processAssistantQuery(question);
    
    // Agregar respuesta del asistente
    setTimeout(() => {
        chatWindow.innerHTML += `
            <div class="chat-message assistant">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    ${response}
                </div>
            </div>
        `;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 500);
    
    input.value = '';
};

app.processAssistantQuery = function(query) {
    const data = app.processedData;
    const lowerQuery = query.toLowerCase();
    
    // Productos más vendidos
    if (lowerQuery.includes('más vendid') || lowerQuery.includes('top producto')) {
        const topProducts = Object.entries(data.productSummary)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 5);
        
        return `
            <p>Los 5 productos más vendidos en octubre fueron:</p>
            <ol>
                ${topProducts.map(([name, stats]) => 
                    `<li><strong>${name}</strong> - ${formatCLP(stats.revenue)} (${stats.qty} unidades)</li>`
                ).join('')}
            </ol>
            <p>El producto estrella fue "${topProducts[0][0]}" con ventas de ${formatCLP(topProducts[0][1].revenue)}.</p>
        `;
    }
    
    // Productos menos vendidos
    if (lowerQuery.includes('menos vendid') || lowerQuery.includes('menor rotación')) {
        const bottomProducts = Object.entries(data.productSummary)
            .sort((a, b) => a[1].revenue - b[1].revenue)
            .slice(0, 5);
        
        return `
            <p>Los productos con menor rotación fueron:</p>
            <ol>
                ${bottomProducts.map(([name, stats]) => 
                    `<li><strong>${name}</strong> - Solo ${stats.qty} unidades (${formatCLP(stats.revenue)})</li>`
                ).join('')}
            </ol>
            <p>💡 <strong>Recomendación:</strong> Considera promociones 2x1 o descuentos del 20-30% para estos productos.</p>
        `;
    }
    
    // Ticket promedio
    if (lowerQuery.includes('ticket') || lowerQuery.includes('promedio')) {
        return `
            <p>El ticket promedio en octubre fue de <strong>${formatCLP(data.avgTicket)}</strong>.</p>
            <p>Con ${data.transactionCount.size} transacciones totales, esto representa una oportunidad de mejora.</p>
            <p>💡 <strong>Sugerencias para aumentar el ticket:</strong></p>
            <ul>
                <li>Crear combos con bebida + pastelería (descuento 10%)</li>
                <li>Promoción "Agrega un postre por solo $1.500"</li>
                <li>Programa de fidelización con beneficios por compras superiores a ${formatCLP(data.avgTicket * 1.5)}</li>
            </ul>
        `;
    }
    
    // Promociones
    if (lowerQuery.includes('promocion') || lowerQuery.includes('promoción') || lowerQuery.includes('conviene')) {
        const lowRotation = Object.entries(data.productSummary)
            .filter(([_, stats]) => stats.qty < 50)
            .map(([name]) => name);
        
        return `
            <p>Basándome en los datos, te recomiendo estas promociones:</p>
            <p><strong>🎯 Promoción 1: Happy Hour Café</strong></p>
            <ul>
                <li>Horario: 14:00 - 17:00 (horas de menor venta)</li>
                <li>2x1 en bebidas seleccionadas</li>
                <li>Impacto esperado: +15% en ventas de tarde</li>
            </ul>
            <p><strong>🎯 Promoción 2: Combo Perfecto</strong></p>
            <ul>
                <li>Café + Pastelería con 15% descuento</li>
                <li>Aumentará ticket promedio de ${formatCLP(data.avgTicket)} a ${formatCLP(data.avgTicket * 1.3)}</li>
            </ul>
            <p><strong>🎯 Promoción 3: Liquidación Mensual</strong></p>
            <ul>
                <li>30% descuento en: ${lowRotation.slice(0, 3).join(', ')}</li>
                <li>Objetivo: Rotar inventario de baja salida</li>
            </ul>
        `;
    }
    
    // Margen
    if (lowerQuery.includes('margen') || lowerQuery.includes('utilidad') || lowerQuery.includes('ganancia')) {
        const bestMarginCategory = Object.entries(data.categorySummary)
            .sort((a, b) => (b[1].margin/b[1].revenue) - (a[1].margin/a[1].revenue))[0];
        
        return `
            <p>El margen bruto promedio es del <strong>${data.marginPercent.toFixed(1)}%</strong>, equivalente a ${formatCLP(data.totalMargin)}.</p>
            <p><strong>Análisis por categoría:</strong></p>
            <ul>
                ${Object.entries(data.categorySummary).map(([cat, stats]) => 
                    `<li>${cat}: ${((stats.margin / stats.revenue) * 100).toFixed(1)}% de margen</li>`
                ).join('')}
            </ul>
            <p>💡 La categoría más rentable es <strong>"${bestMarginCategory[0]}"</strong> con ${((bestMarginCategory[1].margin / bestMarginCategory[1].revenue) * 100).toFixed(1)}% de margen.</p>
            <p>Se recomienda priorizar la venta de productos de esta categoría.</p>
        `;
    }
    
    // Comparación semanal
    if (lowerQuery.includes('semana') || lowerQuery.includes('comparar') || lowerQuery.includes('comparación')) {
        return `
            <p>Comparación de ventas semanales de octubre:</p>
            <ul>
                ${data.weeklyComparison.map(w => 
                    `<li><strong>${w.week}:</strong> ${formatCLP(w.total)}</li>`
                ).join('')}
            </ul>
            <p>📊 <strong>Análisis:</strong></p>
            <ul>
                <li>Mejor semana: ${data.weeklyComparison.sort((a,b) => b.total - a.total)[0].week}</li>
                <li>Variación máxima: ${formatCLP(Math.max(...data.weeklyComparison.map(w => w.total)) - Math.min(...data.weeklyComparison.map(w => w.total)))}</li>
                <li>Tendencia: ${data.weeklyComparison[3].total > data.weeklyComparison[0].total ? '📈 Creciente' : '📉 Decreciente'}</li>
            </ul>
        `;
    }
    
    // Sucursales
    if (lowerQuery.includes('sucursal') || lowerQuery.includes('local') || lowerQuery.includes('tienda')) {
        const branches = Object.entries(data.branchSummary)
            .sort((a, b) => b[1].revenue - a[1].revenue);
        
        return `
            <p>Análisis de rendimiento por sucursal:</p>
            <ol>
                ${branches.map(([branch, stats]) => 
                    `<li><strong>${branch}:</strong> ${formatCLP(stats.revenue)} (${stats.transactions.size} transacciones)</li>`
                ).join('')}
            </ol>
            <p>📍 La sucursal líder es <strong>"${branches[0][0]}"</strong> con ${((branches[0][1].revenue / data.totalSales) * 100).toFixed(1)}% del total de ventas.</p>
            <p>💡 <strong>Recomendación:</strong> Replicar las mejores prácticas de ${branches[0][0]} en las demás sucursales.</p>
        `;
    }
    
    // Respuesta por defecto
    return `
        <p>Entiendo tu pregunta sobre "${query}". Aquí hay un resumen general:</p>
        <ul>
            <li>Ventas totales: ${formatCLP(data.totalSales)}</li>
            <li>Ticket promedio: ${formatCLP(data.avgTicket)}</li>
            <li>Margen: ${data.marginPercent.toFixed(1)}%</li>
            <li>Transacciones: ${data.transactionCount.size}</li>
        </ul>
        <p>Puedes preguntarme específicamente sobre:</p>
        <ul>
            <li>Productos más o menos vendidos</li>
            <li>Análisis de márgenes</li>
            <li>Comparaciones semanales</li>
            <li>Recomendaciones de promociones</li>
            <li>Análisis por sucursal</li>
        </ul>
    `;
};

// Navegación
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Actualizar navegación activa
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(section).classList.add('active');
            
            // Si es la sección de gráficos, crear los gráficos adicionales
            if (section === 'charts' && !app.charts.trend) {
                setTimeout(() => createAdditionalCharts(), 100);
            }
        });
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Generar datos de muestra
    app.demoData = generateDemoData();
    
    // Procesar datos
    app.processedData = processData(app.demoData);
    
    // Actualizar KPIs
    updateKPIs();
    
    // Crear gráficos iniciales
    createCharts();
    
    // Actualizar tabla de productos
    updateTopProducts();
    
    // Inicializar navegación
    initNavigation();
    
    console.log('Análisis Fudo iniciado correctamente');
    console.log(`Datos cargados: ${app.demoData.sales.length} registros de venta`);
});
