<?php
/**
 * Error reporting
 */
if (ob_get_level() == 0) ob_start();
//error_reporting(E_ALL | E_STRICT);
ob_start();

/**
 * Compilation includes configuration file
 */
define('MAGENTO_ROOT', realpath(dirname(__FILE__).'/..' ));

$compilerConfig = MAGENTO_ROOT . '/includes/config.php';
if (file_exists($compilerConfig)) {
    include $compilerConfig;
}

$mageFilename = MAGENTO_ROOT . '/app/Mage.php';

require_once $mageFilename;

if (!Mage::isInstalled()) {
    echo "Application is not installed yet, please complete install wizard first.";
    exit;
}
#Varien_Profiler::enable();

if (isset($_SERVER['MAGE_IS_DEVELOPER_MODE'])) {
    Mage::setIsDeveloperMode(true);
}


/* Store or website code */
$mageRunCode = isset($_SERVER['MAGE_RUN_CODE']) ? $_SERVER['MAGE_RUN_CODE'] : '';

/* Run store or run website */
$mageRunType = isset($_SERVER['MAGE_RUN_TYPE']) ? $_SERVER['MAGE_RUN_TYPE'] : 'store';

Mage::app('admin')->setUseSessionInUrl(false);
umask(0);
$writer = new Zend_Log_Writer_Syslog(array('application' => 'Positif_Poste'));
$writer->setFacility(LOG_USER);
$log = new Zend_Log($writer);
$log->addPriority('TABLE', 8);
$log->info('setcmd');

/*
script a mettre dans le repertoir pay sur la racine de votre site

de preférence restreindre l'accés a ce repertoir que pour l'adresse locale du site  

*/
error_reporting(0);

$id_tr=$_GET['id_tr'];
$oId = (int)$_GET['id_tr'];
$order = Mage::getModel('sales/order');
$postepay = Mage::getModel('poste/standard');
try {
	$order->loadByIncrementId($oId);
	$montant = number_format($order->getGrandTotal(), 3, '.', '');
// connection à la base de données pour recupérer le données suivantes 
		//$montant="10,000"; //avec virgule
		$montant=sprintf("%013s", $montant);
		$facture=substr($oId,-6,6);
		$type_doc="0102";
		$code_marchant=(int)$postepay->getMerchantId(); // 
		$str = "$id_tr|$facture|0102|$montant|$code_marchant";	
		$log->info($str);
		header("Content-Type: text/html");
		echo $str;
		flush();
		exit;
} catch(Exception $exc) {
	$log->info($exc->getMessage());
}
