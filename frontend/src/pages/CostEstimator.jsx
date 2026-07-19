import { useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Stepper, Step, StepLabel, FormControlLabel, Checkbox, RadioGroup, Radio, FormControl, FormLabel, Slider, Divider, CircularProgress, Chip } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getServices, calculate, getProjectTypes } from '../api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AREA_MARKS = [{ value: 500, label: '500' }, { value: 1200, label: '1200' }, { value: 2200, label: '2200' }, { value: 5000, label: '5000' }];
const STEPS = ['Project Type', 'Area', 'Services', 'Delivery', 'Result'];

export default function CostEstimator() {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState('');
  const [area, setArea] = useState(1200);
  const [selectedServices, setSelectedServices] = useState([]);
  const [urgent, setUrgent] = useState(false);
  const [result, setResult] = useState(null);

  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: getServices });
  const { data: projectTypesData = [] } = useQuery({ queryKey: ['project-types'], queryFn: getProjectTypes });
  const PROJECT_TYPES = projectTypesData.map(pt => pt.name);

  const { mutate, isPending } = useMutation({
    mutationFn: () => calculate({ services: selectedServices, area, urgent, projectType }),
    onSuccess: (data) => { setResult(data); setStep(4); },
    onError: () => toast.error('Calculation failed. Please try again.'),
  });

  const toggleService = (name) => {
    setSelectedServices(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  const canNext = () => {
    if (step === 0) return !!projectType;
    if (step === 1) return area > 0;
    if (step === 2) return selectedServices.length > 0;
    return true;
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" textAlign="center" mb={1}>Cost Estimator</Typography>
      <Typography textAlign="center" color="text.secondary" mb={5}>Get an instant architecture fee estimate</Typography>

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 5 }}>
        {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      <Paper sx={{ p: 4 }}>
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>Choose Project Type</FormLabel>
              <Grid container spacing={2}>
                {PROJECT_TYPES.map(type => (
                  <Grid item xs={6} sm={4} key={type}>
                    <Paper variant="outlined" onClick={() => setProjectType(type)} sx={{ p: 2, textAlign: 'center', cursor: 'pointer', borderColor: projectType === type ? 'secondary.main' : 'divider', bgcolor: projectType === type ? 'secondary.main' : 'transparent', color: projectType === type ? 'white' : 'inherit', transition: 'all 0.2s' }}>
                      <Typography fontWeight={500}>{type}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </FormControl>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography variant="h6" mb={3}>Select Area (sq ft)</Typography>
            <Box px={2}>
              <Slider value={area} onChange={(_, v) => setArea(v)} min={200} max={10000} step={100} marks={AREA_MARKS} valueLabelDisplay="on" color="secondary" />
            </Box>
            <Typography textAlign="center" variant="h4" mt={3} color="secondary.main">{area.toLocaleString()} sq ft</Typography>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography variant="h6" mb={3}>Select Architecture Services</Typography>
            <Grid container spacing={1}>
              {services.map(s => {
                const typePrice = s.project_type_pricing?.[projectType];
                const displayPrice = typePrice != null ? typePrice : s.price_per_sqft;
                return (
                  <Grid item xs={12} sm={6} key={s.service}>
                    <FormControlLabel
                      control={<Checkbox checked={selectedServices.includes(s.service)} onChange={() => toggleService(s.service)} color="secondary" />}
                      label={<Box><Typography variant="body2">{s.service}</Typography><Typography variant="caption" color="text.secondary">₹{displayPrice}/sqft{typePrice != null ? ` (${projectType})` : ''}</Typography></Box>}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography variant="h6" mb={3}>Urgent Delivery?</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Urgent delivery adds 20% to the total fee.</Typography>
            <Grid container spacing={2}>
              {[false, true].map(val => (
                <Grid item xs={6} key={String(val)}>
                  <Paper variant="outlined" onClick={() => setUrgent(val)} sx={{ p: 3, textAlign: 'center', cursor: 'pointer', borderColor: urgent === val ? 'secondary.main' : 'divider', bgcolor: urgent === val ? 'secondary.main' : 'transparent', color: urgent === val ? 'white' : 'inherit', transition: 'all 0.2s' }}>
                    <Typography fontWeight={600}>{val ? 'Yes' : 'No'}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {step === 4 && result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Typography variant="h5" textAlign="center" mb={3}>Your Estimate</Typography>
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 3, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Project Type</Typography><Typography fontWeight={600}>{projectType}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Area</Typography><Typography fontWeight={600}>{area.toLocaleString()} sq ft</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Services</Typography>
                <Box display="flex" gap={0.5} flexWrap="wrap" justifyContent="flex-end" maxWidth="60%">
                  {selectedServices.map(s => <Chip key={s} label={s} size="small" />)}
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Urgent</Typography><Typography fontWeight={600}>{urgent ? 'Yes (+20%)' : 'No'}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="h6">Architecture Fee</Typography>
              <Typography variant="h6">₹{result.architecture_fee.toLocaleString('en-IN')}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">GST (18%)</Typography>
              <Typography color="text.secondary">₹{result.gst.toLocaleString('en-IN')}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h5" fontWeight={700} color="secondary.main">Total</Typography>
              <Typography variant="h5" fontWeight={700} color="secondary.main">₹{result.total.toLocaleString('en-IN')}</Typography>
            </Box>
            <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => { setStep(0); setResult(null); setSelectedServices([]); setProjectType(''); }}>
              Start New Estimate
            </Button>
          </motion.div>
        )}

        {step < 4 && (
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
            {step < 3 ? (
              <Button variant="contained" color="secondary" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>Next</Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={() => mutate()} disabled={isPending}>
                {isPending ? <CircularProgress size={20} /> : 'Calculate'}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
