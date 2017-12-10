<?php

class Positif_Poste_Block_Standard_Form extends Mage_Payment_Block_Form
{
	protected function _construct() {
		parent::_construct();
        $this->setTemplate( 'poste/view.phtml' );
	}
}
